import crypto from "crypto";

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
        "http://localhost:5173";

    return configuredOrigin.replace(/\/+$/, "");
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

const buildFrontendRedirectUrl = ({ paymentStatus, responseCode = "", txnRef = "" }) => {
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

    return `${getFrontendBaseUrl()}/order-confirmation?${searchParams.toString()}`;
};

const vnpayController = {
    createPaymentUrl: async (req, res, next) => {
        try {
            const tmnCode = process.env.VNPAY_TMN?.trim();
            const secureSecret = process.env.VNPAY_SECURE_SECRET?.trim();
            const returnUrl = process.env.VNPAY_RETURN_URL?.trim();
            const paymentHost = buildVnpayPaymentUrl(process.env.VNPAY_HOST);

            if (!tmnCode || !secureSecret || !returnUrl || !paymentHost) {
                return res.status(500).json({ message: "VNPay configuration is incomplete" });
            }
            const amount = Math.round(Number(req.body.totalPrice ?? req.body.total_price ?? 0));

            if (!Number.isFinite(amount) || amount <= 0) {
                return res.status(400).json({ message: "Invalid payment amount" });
            }

            const createDate = formatVnpDate();
            const expireDate = formatVnpDate(Date.now() + 15 * 60 * 1000);
            const txnRef = `${Date.now()}-${req.user?.id || "guest"}`;
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

            const redirectUrl = buildFrontendRedirectUrl({
                paymentStatus: isPaymentSuccessful ? "success" : isValidSignature ? "failed" : "invalid",
                responseCode,
                txnRef,
            });

            return res.redirect(redirectUrl);
        } catch (error) {
            next(error);
        }
    },
};

export default vnpayController;
