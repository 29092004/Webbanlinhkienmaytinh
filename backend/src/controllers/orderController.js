import orderModel from '../models/orderModel.js';
import shippingModel from '../models/shippingModel.js';

const normalizeOrderDetails = (
    value,
    fallbackProductId = null,
    fallbackQuantity = 1,
    fallbackSubtotalPrice = null,
    fallbackNote = null
) => {
    if (Array.isArray(value)) {
        return value;
    }

    if (typeof value === 'string' && value.trim()) {
        try {
            const parsedValue = JSON.parse(value);
            return Array.isArray(parsedValue) ? parsedValue : [];
        } catch {
            return [];
        }
    }

    if (fallbackProductId) {
        return [{
            productId: fallbackProductId,
            quantity: fallbackQuantity,
            subtotalPrice: fallbackSubtotalPrice,
            note: fallbackNote,
        }];
    }

    return [];
};

const parseRequiredNumber = (value) => {
    if (value === undefined || value === null || value === '') {
        return null;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
};

const normalizeOrderPayload = (body = {}) => {
    const createdAt = body.createdAt ?? body.created_at;
    const paymentMethod = body.paymentMethod ?? body.payment_method;
    const status = body.status;
    const accountId = body.accountId ?? body.account_id;
    const voucherId = body.voucherId ?? body.voucher_id ?? null;
    const totalPrice = parseRequiredNumber(body.totalPrice ?? body.total_price);
    const discountAmount = parseRequiredNumber(body.discountAmount ?? body.discount_amount ?? 0);
    const finalPrice = parseRequiredNumber(body.finalPrice ?? body.final_price ?? body.totalPrice ?? body.total_price);
    const customerAddress = body.customerAddress ?? body.customer_address ?? '';
    const deliveryMethod = body.deliveryMethod ?? body.delivery_method ?? 'Standard';
    const legacyProductId = body.productId ?? body.product_id ?? null;
    const quantity = body.quantity ?? 1;
    const subtotalPrice = body.subtotalPrice ?? body.subtotal_price ?? totalPrice ?? null;
    const note = body.note ?? null;
    const details = normalizeOrderDetails(body.details, legacyProductId, quantity, subtotalPrice, note);

    return {
        createdAt,
        paymentMethod,
        status,
        accountId,
        voucherId,
        totalPrice,
        discountAmount,
        finalPrice,
        customerAddress,
        deliveryMethod,
        details,
    };
};

const isValidOrderPayload = (payload) => {
    if (!payload.createdAt || !payload.paymentMethod || !payload.status || !payload.accountId) {
        return false;
    }

    if (payload.totalPrice === null || payload.finalPrice === null || payload.discountAmount === null) {
        return false;
    }

    if (!String(payload.customerAddress || '').trim()) {
        return false;
    }

    return true;
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
            const payload = normalizeOrderPayload(req.body);

            if (!isValidOrderPayload(payload)) {
                return res.status(400).json({ message: 'Invalid input' });
            }

            const orderId = await orderModel.create(payload);
            await shippingModel.create(
                payload.createdAt,
                payload.deliveryMethod,
                'PENDING',
                orderId,
                String(payload.customerAddress).trim()
            );
            const createdOrder = await orderModel.getById(orderId);

            res.status(201).json({ success: true, orderId, data: createdOrder });
        } catch (error) {
            next(error);
        }
    },

    updateOrder: async (req, res, next) => {
        try {
            const { id } = req.params;
            const payload = normalizeOrderPayload(req.body);

            if (!isValidOrderPayload(payload)) {
                return res.status(400).json({ message: 'Invalid input' });
            }

            const affectedRows = await orderModel.update(id, payload);
            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Order not found' });
            }

            const updatedOrder = await orderModel.getById(id);
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
