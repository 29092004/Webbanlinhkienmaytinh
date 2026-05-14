import orderModel from '../models/orderModel.js';

const orderController = {
    getOrders: async (req, res) => {
        try {
            const rows = await orderModel.getAll();
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
            const productId = req.body.productId ?? req.body.product_id;
            const accountId = req.body.accountId ?? req.body.account_id;

            if (!createdAt || !paymentMethod || !status || !productId || !accountId) {
                return res.status(400).json({ message: 'Invalid input' });
            }

            const orderId = await orderModel.create(createdAt, paymentMethod, status, productId, accountId);
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
            const productId = req.body.productId ?? req.body.product_id;
            const accountId = req.body.accountId ?? req.body.account_id;

            if (!createdAt || !paymentMethod || !status || !productId || !accountId) {
                return res.status(400).json({ message: 'Invalid input' });
            }

            const affectedRows = await orderModel.update(id, createdAt, paymentMethod, status, productId, accountId);
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
