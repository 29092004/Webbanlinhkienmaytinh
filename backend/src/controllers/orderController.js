import orderModel from '../models/orderModel.js';

const normalizeOrderDetails = (value, fallbackProductId = null, fallbackQuantity = 1, fallbackSubtotalPrice = null, fallbackNote = null) => {
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
            const createdAt = req.body.createdAt ?? req.body.created_at;
            const paymentMethod = req.body.paymentMethod ?? req.body.payment_method;
            const { status } = req.body;
            const accountId = req.body.accountId ?? req.body.account_id;
            const voucherId = req.body.voucherId ?? req.body.voucher_id ?? null;
            const totalPrice = req.body.totalPrice ?? req.body.total_price;
            const legacyProductId = req.body.productId ?? req.body.product_id ?? null;
            const quantity = req.body.quantity ?? 1;
            const subtotalPrice = req.body.subtotalPrice ?? req.body.subtotal_price ?? totalPrice ?? null;
            const note = req.body.note ?? null;
            const details = normalizeOrderDetails(req.body.details, legacyProductId, quantity, subtotalPrice, note);

            if (!createdAt || !paymentMethod || !status || !accountId || totalPrice === undefined) {
                return res.status(400).json({ message: 'Invalid input' });
            }

            const orderId = await orderModel.create(
                createdAt,
                paymentMethod,
                status,
                accountId,
                voucherId,
                totalPrice,
                details
            );

            res.status(201).json({ success: true, orderId });
        } catch (error) {
            next(error);
        }
    },

    updateOrder: async (req, res, next) => {
        try {
            const { id } = req.params;
            const createdAt = req.body.createdAt ?? req.body.created_at;
            const paymentMethod = req.body.paymentMethod ?? req.body.payment_method;
            const { status } = req.body;
            const accountId = req.body.accountId ?? req.body.account_id;
            const voucherId = req.body.voucherId ?? req.body.voucher_id ?? null;
            const totalPrice = req.body.totalPrice ?? req.body.total_price;
            const legacyProductId = req.body.productId ?? req.body.product_id ?? null;
            const quantity = req.body.quantity ?? 1;
            const subtotalPrice = req.body.subtotalPrice ?? req.body.subtotal_price ?? totalPrice ?? null;
            const note = req.body.note ?? null;
            const details = normalizeOrderDetails(req.body.details, legacyProductId, quantity, subtotalPrice, note);

            if (!createdAt || !paymentMethod || !status || !accountId || totalPrice === undefined) {
                return res.status(400).json({ message: 'Invalid input' });
            }

            const affectedRows = await orderModel.update(
                id,
                createdAt,
                paymentMethod,
                status,
                accountId,
                voucherId,
                totalPrice,
                details
            );

            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Order not found' });
            }
            res.json({ success: true });
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
