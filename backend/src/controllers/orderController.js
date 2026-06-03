import orderModel from '../models/orderModel.js';
import shippingModel from '../models/shippingModel.js';
import customerModel from '../models/customerModel.js';
import { emailService } from '../services/emailService.js';
import { buildSecureOrderPayload } from '../services/orderPricingService.js';

const parseRequiredNumber = (value) => {
    if (value === undefined || value === null || value === '') {
        return null;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
};

const normalizeOrderDetails = (value) => {
    if (Array.isArray(value)) {
        return value;
    }

    if (typeof value === 'string' && value.trim()) {
        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }

    return [];
};

const normalizeOrderPayload = (body = {}) => ({
    createdAt: body.createdAt ?? body.created_at,
    paymentMethod: body.paymentMethod ?? body.payment_method,
    status: body.status,
    accountId: body.accountId ?? body.account_id,
    voucherId: body.voucherId ?? body.voucher_id ?? null,
    totalPrice: parseRequiredNumber(body.totalPrice ?? body.total_price),
    discountAmount: parseRequiredNumber(body.discountAmount ?? body.discount_amount ?? 0),
    finalPrice: parseRequiredNumber(body.finalPrice ?? body.final_price ?? body.totalPrice ?? body.total_price),
    customerAddress: body.customerAddress ?? body.customer_address ?? '',
    customerEmail: body.customerEmail ?? body.customer_email ?? '',
    customerPhone: body.customerPhone ?? body.customer_phone ?? '',
    customerFirstName: body.customerFirstName ?? body.customer_first_name ?? '',
    customerLastName: body.customerLastName ?? body.customer_last_name ?? '',
    deliveryMethod: body.deliveryMethod ?? body.delivery_method ?? 'Standard',
    details: normalizeOrderDetails(body.details),
});

const isValidOrderPayload = (payload, { requireCustomerAddress = true } = {}) => {
    if (!payload.createdAt || !payload.paymentMethod || !payload.status || !payload.accountId) {
        return false;
    }

    if (payload.totalPrice === null || payload.finalPrice === null || payload.discountAmount === null) {
        return false;
    }

    if (requireCustomerAddress && !String(payload.customerAddress || '').trim()) {
        return false;
    }

    return Array.isArray(payload.details);
};

const orderController = {
    getOrders: async (req, res) => {
        try {
            const rows = req.user?.role === 'user'
                ? await orderModel.getByAccountId(req.user.id)
                : await orderModel.getAll();

            res.json({ success: true, data: rows });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    getOrderById: async (req, res) => {
        try {
            const { id } = req.params;
            const row = await orderModel.getById(id);
            if (!row) {
                return res.status(404).json({ message: 'Order not found' });
            }

            if (req.user?.role === 'user' && Number(row.account_id) !== Number(req.user.id)) {
                return res.status(403).json({ message: 'Forbidden' });
            }

            res.json({ success: true, data: row });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    createOrder: async (req, res, next) => {
        try {
            const requestedPaymentMethod = String(req.body.paymentMethod ?? req.body.payment_method ?? '').trim().toUpperCase();
            if (requestedPaymentMethod === 'VNPAY') {
                return res.status(400).json({ message: 'Vui lòng sử dụng cổng thanh toán VNPay để tạo đơn hàng online.' });
            }

            const payload = await buildSecureOrderPayload({
                body: req.body,
                authenticatedUser: req.user,
                allowPrivilegedAccountOverride: true,
            });

            const existingCustomer = await customerModel.getById(payload.accountId);
            if (existingCustomer) {
                await customerModel.update(
                    payload.accountId,
                    String(payload.customerFirstName || existingCustomer.first_name || existingCustomer.firstName || '').trim() || 'Khách hàng',
                    String(payload.customerLastName || existingCustomer.last_name || existingCustomer.lastName || '').trim(),
                    String(payload.customerEmail || existingCustomer.email || '').trim(),
                    String(payload.customerPhone || existingCustomer.phone || '').trim(),
                    String(payload.customerAddress || existingCustomer.address || '').trim()
                );
            }

            const orderId = await orderModel.create(payload);
            const createdOrder = await orderModel.getById(orderId);

            if (createdOrder) {
                emailService.sendOrderConfirmationEmail(createdOrder).catch((err) => {
                    console.error('Lỗi gửi email xác nhận đặt hàng:', err);
                });
            }

            res.status(201).json({ success: true, orderId, data: createdOrder });
        } catch (error) {
            next(error);
        }
    },

    updateOrder: async (req, res, next) => {
        try {
            const { id } = req.params;
            const existingOrder = await orderModel.getById(id);

            if (!existingOrder) {
                return res.status(404).json({ message: 'Order not found' });
            }

            const payload = normalizeOrderPayload({
                ...req.body,
                customerAddress:
                    req.body.customerAddress ??
                    req.body.customer_address ??
                    existingOrder.customer_address ??
                    existingOrder.shipping_address ??
                    existingOrder.shippingAddress ??
                    existingOrder.profile_customer_address ??
                    '',
                deliveryMethod:
                    req.body.deliveryMethod ??
                    req.body.delivery_method ??
                    existingOrder.shipping_delivery_method ??
                    existingOrder.shippingDeliveryMethod ??
                    'Standard',
                details:
                    req.body.details ??
                    existingOrder.details?.map((detail) => ({
                        productId: detail.product_id,
                        quantity: detail.quantity,
                        subtotalPrice: detail.subtotal_price,
                        note: detail.note ?? null,
                    })) ??
                    [],
            });

            if (!isValidOrderPayload(payload, { requireCustomerAddress: false })) {
                return res.status(400).json({ message: 'Invalid input' });
            }

            const oldStatus = existingOrder.status;
            const newStatus = payload.status;

            const affectedRows = await orderModel.update(id, payload);

            if (payload.status?.toUpperCase() === 'COMPLETED') {
                await shippingModel.updateLatestStatusByOrderId(id, 'DELIVERED');
            }

            const updatedOrder = await orderModel.getById(id);

            if (updatedOrder && oldStatus !== newStatus) {
                emailService.sendOrderStatusUpdateEmail(updatedOrder).catch((err) => {
                    console.error('Lỗi gửi email cập nhật trạng thái đơn hàng:', err);
                });
            }

            res.json({ success: true, data: updatedOrder });
        } catch (error) {
            next(error);
        }
    },

    deleteOrder: async (req, res) => {
        try {
            const { id } = req.params;
            const affectedRows = await orderModel.delete(id);
            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Order not found' });
            }

            res.json({ success: true });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },
};

export default orderController;
