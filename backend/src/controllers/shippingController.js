import shippingModel from '../models/shippingModel.js';

const shippingController = {
    getShippings: async (req, res) => {
        try {
            const rows = await shippingModel.getAll();
            res.json({ success: true, data: rows });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    getShippingById: async (req, res) => {
        try {
            const { id } = req.params;
            const row = await shippingModel.getById(id);
            if (!row) {
                return res.status(404).json({ message: 'Shipping not found' });
            }
            res.json({ success: true, data: row });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    createShipping: async (req, res, next) => {
        try {
            const { date, status } = req.body;
            const deliveryMethod = req.body.deliveryMethod ?? req.body.delivery_method;
            const customerId = req.body.customerId ?? req.body.id_customer;
            const orderId = req.body.orderId ?? req.body.id_order;
            const shippingAddress = req.body.shippingAddress ?? req.body.shipping_address;

            if (!date || !deliveryMethod || !status || !customerId || !orderId || !shippingAddress) {
                return res.status(400).json({ message: 'Invalid input' });
            }

            const shippingId = await shippingModel.create(date, deliveryMethod, status, customerId, orderId, shippingAddress);
            res.status(201).json({ success: true, shippingId });
        } catch (error) {
            next(error);
        }
    },

    updateShipping: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { date, status } = req.body;
            const deliveryMethod = req.body.deliveryMethod ?? req.body.delivery_method;
            const customerId = req.body.customerId ?? req.body.id_customer;
            const orderId = req.body.orderId ?? req.body.id_order;
            const shippingAddress = req.body.shippingAddress ?? req.body.shipping_address;

            if (!date || !deliveryMethod || !status || !customerId || !orderId || !shippingAddress) {
                return res.status(400).json({ message: 'Invalid input' });
            }

            const affectedRows = await shippingModel.update(id, date, deliveryMethod, status, customerId, orderId, shippingAddress);
            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Shipping not found' });
            }
            res.json({ success: true });
        } catch (error) {
            next(error);
        }
    },

    deleteShipping: async (req, res) => {
        try {
            const { id } = req.params;
            const affectedRows = await shippingModel.delete(id);
            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Shipping not found' });
            }
            res.json({ success: true });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },
};

export default shippingController;
