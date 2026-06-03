import crypto from "crypto";
import orderModel from "../models/orderModel.js";
import pendingVnpayOrderModel from "../models/pendingVnpayOrderModel.js";
import customerModel from "../models/customerModel.js";
import { emailService } from "../services/emailService.js";
import { buildSecureOrderPayload, toMysqlDateTime } from "../services/orderPricingService.js";

const VNPAY_DEFAULT_PATH = "/paymentv2/vpcpay.html";

const formatVnpDate = (value = new Date()) => {
    const date = new Date(value);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
};

const buildSortedQuery = (params) => {
    const searchParams = new URLSearchParams();

    Object.keys(params)
        .sort()
        .forEach((key) => {
            const value = params[key];

            if (value !== undefined && value !== null && value !== "") {
                searchParams.append(key, String(value));
            }
        });

    return searchParams.toString();
};

const buildVnpayPaymentUrl = (baseHost) => {
    const normalizedHost = String(baseHost || "").trim().replace(/\/+$/, "");

    if (!normalizedHost) {
        return "";
    }

    return normalizedHost.includes("/paymentv2/")
        ? normalizedHost
        : `${normalizedHost}${VNPAY_DEFAULT_PATH}`;
};

const getFrontendBaseUrl = () => {
    const configuredOrigin =
        process.env.FRONTEND_PAYMENT_RETURN_URL?.trim() ||
        process.env.FRONTEND_URL?.trim() ||
        process.env.FRONTEND_URLS?.split(",").map((value) => value.trim()).find(Boolean) ||
        (!process.env.NODE_ENV || process.env.NODE_ENV !== "production" ? "http://localhost:5173" : "");

    return String(configuredOrigin || "").replace(/\/+$/, "");
};

const signVnpayParams = (params, secret) =>
    crypto.createHmac("sha512", secret).update(buildSortedQuery(params), "utf8").digest("hex");

const getClientIpAddress = (req) => {
    const forwardedFor = req.headers["x-forwarded-for"];

    if (typeof forwardedFor === "string" && forwardedFor.trim()) {
        return forwardedFor.split(",")[0].trim();
    }

    return req.ip || req.socket?.remoteAddress || "127.0.0.1";
};

const buildFrontendRedirectUrl = ({ paymentStatus, responseCode = "", txnRef = "", orderId = "" }) => {
    const frontendBaseUrl = getFrontendBaseUrl();
    if (!frontendBaseUrl) {
        return "";
    }

    const searchParams = new URLSearchParams({
        paymentStatus,
        paymentMethod: "VNPAY",
    });

    if (responseCode) {
        searchParams.set("responseCode", responseCode);
    }
    if (txnRef) {
        searchParams.set("txnRef", txnRef);
    }
    if (orderId) {
        searchParams.set("orderId", String(orderId));
    }

    return `${frontendBaseUrl}/order-confirmation?${searchParams.toString()}`;
};

const vnpayController = {
    createPaymentUrl: async (req, res, next) => {
        try {
            const tmnCode = process.env.VNPAY_TMN?.trim();
            const secureSecret = process.env.VNPAY_SECURE_SECRET?.trim();
            const returnUrl = process.env.VNPAY_RETURN_URL?.trim();
            const paymentHost = buildVnpayPaymentUrl(process.env.VNPAY_HOST);
            const frontendBaseUrl = getFrontendBaseUrl();

            if (!tmnCode || !secureSecret || !returnUrl || !paymentHost || !frontendBaseUrl) {
                return res.status(500).json({ message: "VNPay configuration is incomplete" });
            }

            const secureOrderPayload = await buildSecureOrderPayload({
                body: {
                    ...req.body,
                    paymentMethod: "VNPAY",
                },
                authenticatedUser: req.user,
                allowPrivilegedAccountOverride: true,
            });

            const amount = Math.round(Number(secureOrderPayload.finalPrice ?? 0));
            if (!Number.isFinite(amount) || amount <= 0) {
                return res.status(400).json({ message: "Invalid payment amount" });
            }

            const createDate = formatVnpDate();
            const expireDate = formatVnpDate(Date.now() + 15 * 60 * 1000);
            const txnRef = `${Date.now()}-${req.user?.id || "guest"}`;
            const expiresAt = toMysqlDateTime(Date.now() + 15 * 60 * 1000);
            const vnpParams = {
                vnp_Version: "2.1.0",
                vnp_Command: "pay",
                vnp_TmnCode: tmnCode,
                vnp_Locale: "vn",
                vnp_CurrCode: "VND",
                vnp_TxnRef: txnRef,
                vnp_OrderInfo: `Thanh toan don hang tam ${txnRef}`,
                vnp_OrderType: "other",
                vnp_Amount: amount * 100,
                vnp_ReturnUrl: returnUrl,
                vnp_IpAddr: getClientIpAddress(req),
                vnp_CreateDate: createDate,
                vnp_ExpireDate: expireDate,
            };

            await pendingVnpayOrderModel.create({
                txnRef,
                accountId: secureOrderPayload.accountId,
                amount,
                orderPayload: secureOrderPayload,
                expiresAt,
            });

            const vnpSecureHash = signVnpayParams(vnpParams, secureSecret);
            const paymentUrl = `${paymentHost}?${buildSortedQuery({
                ...vnpParams,
                vnp_SecureHash: vnpSecureHash,
            })}`;

            res.json({ success: true, paymentUrl });
        } catch (error) {
            next(error);
        }
    },

    handleReturn: async (req, res, next) => {
        try {
            const secureSecret = process.env.VNPAY_SECURE_SECRET?.trim();
            const query = { ...req.query };
            const txnRef = String(query.vnp_TxnRef || "");
            const responseCode = String(query.vnp_ResponseCode || "");
            const transactionStatus = String(query.vnp_TransactionStatus || "");
            const receivedHash = String(query.vnp_SecureHash || "");

            delete query.vnp_SecureHash;
            delete query.vnp_SecureHashType;

            const expectedHash = secureSecret ? signVnpayParams(query, secureSecret) : "";
            const isValidSignature = Boolean(secureSecret && receivedHash && expectedHash === receivedHash);
            const isPaymentSuccessful =
                isValidSignature && responseCode === "00" && transactionStatus === "00";
            const pendingOrder = txnRef ? await pendingVnpayOrderModel.getByTxnRef(txnRef) : null;

            if (!pendingOrder) {
                const redirectUrl = buildFrontendRedirectUrl({
                    paymentStatus: "invalid",
                    responseCode,
                    txnRef,
                });

                if (!redirectUrl) {
                    return res.status(500).json({ message: "Frontend payment return URL is not configured" });
                }

                return res.redirect(redirectUrl);
            }

            const expectedAmount = Number(query.vnp_Amount || 0) / 100;
            if (!isValidSignature || expectedAmount !== Number(pendingOrder.amount || 0)) {
                await pendingVnpayOrderModel.markStatus({
                    txnRef,
                    status: "INVALID",
                    responseCode,
                });

                const redirectUrl = buildFrontendRedirectUrl({
                    paymentStatus: "invalid",
                    responseCode,
                    txnRef,
                });

                if (!redirectUrl) {
                    return res.status(500).json({ message: "Frontend payment return URL is not configured" });
                }

                return res.redirect(redirectUrl);
            }

            if (!isPaymentSuccessful) {
                await pendingVnpayOrderModel.markStatus({
                    txnRef,
                    status: "FAILED",
                    responseCode,
                });

                const redirectUrl = buildFrontendRedirectUrl({
                    paymentStatus: "failed",
                    responseCode,
                    txnRef,
                });

                if (!redirectUrl) {
                    return res.status(500).json({ message: "Frontend payment return URL is not configured" });
                }

                return res.redirect(redirectUrl);
            }

            if (pendingOrder.status === "COMPLETED" && pendingOrder.order_id) {
                const redirectUrl = buildFrontendRedirectUrl({
                    paymentStatus: "success",
                    responseCode,
                    txnRef,
                    orderId: pendingOrder.order_id,
                });

                if (!redirectUrl) {
                    return res.status(500).json({ message: "Frontend payment return URL is not configured" });
                }

                return res.redirect(redirectUrl);
            }

            const orderPayload = pendingOrder.orderPayload;
            if (!orderPayload) {
                await pendingVnpayOrderModel.markStatus({
                    txnRef,
                    status: "INVALID",
                    responseCode,
                });

                const redirectUrl = buildFrontendRedirectUrl({
                    paymentStatus: "invalid",
                    responseCode,
                    txnRef,
                });

                if (!redirectUrl) {
                    return res.status(500).json({ message: "Frontend payment return URL is not configured" });
                }

                return res.redirect(redirectUrl);
            }

            const existingCustomer = await customerModel.getById(orderPayload.accountId);
            if (existingCustomer) {
                await customerModel.update(
                    orderPayload.accountId,
                    String(orderPayload.customerFirstName || existingCustomer.first_name || existingCustomer.firstName || '').trim() || 'Khách hàng',
                    String(orderPayload.customerLastName || existingCustomer.last_name || existingCustomer.lastName || '').trim(),
                    String(orderPayload.customerEmail || existingCustomer.email || '').trim(),
                    String(orderPayload.customerPhone || existingCustomer.phone || '').trim(),
                    String(orderPayload.customerAddress || existingCustomer.address || '').trim()
                );
            }

            const orderId = await orderModel.create(orderPayload);
            const createdOrder = await orderModel.getById(orderId);

            await pendingVnpayOrderModel.markCompleted({
                txnRef,
                orderId,
                responseCode,
            });

            if (createdOrder) {
                emailService.sendOrderConfirmationEmail(createdOrder).catch((err) => {
                    console.error('Lỗi gửi email xác nhận đặt hàng:', err);
                });
            }

            const redirectUrl = buildFrontendRedirectUrl({
                paymentStatus: "success",
                responseCode,
                txnRef,
                orderId,
            });

            if (!redirectUrl) {
                return res.status(500).json({ message: "Frontend payment return URL is not configured" });
            }

            return res.redirect(redirectUrl);
        } catch (error) {
            next(error);
        }
    },
};

export default vnpayController;
