import cartModel from '../models/cartModel.js';

const cartController = {
    getCarts: async (req, res) => {
        try {
            const rows = await cartModel.getAll();
            res.json({ success: true, data: rows });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    getCartById: async (req, res) => {
        try {
            const { customerId, productId } = req.params;
            const row = await cartModel.getById(customerId, productId);
            if (!row) {
                return res.status(404).json({ message: 'Cart not found' });
            }
            res.json({ success: true, data: row });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    createCart: async (req, res, next) => {
        try {
            const quantity = req.body.quantity;
            const productId = req.body.productId ?? req.body.product_id;
            const customerId = req.body.customerId ?? req.body.customer_id;

            if (quantity === undefined || !productId || !customerId) {
                return res.status(400).json({ message: 'Quantity, productId and customerId are required' });
            }

            await cartModel.create(quantity, productId, customerId);
            res.status(201).json({ success: true });
        } catch (error) {
            next(error);
        }
    },

    updateCart: async (req, res, next) => {
        try {
            const { customerId, productId } = req.params;
            const quantity = req.body.quantity;

            if (quantity === undefined) {
                return res.status(400).json({ message: 'Quantity is required' });
            }

            const affectedRows = await cartModel.update(customerId, productId, quantity);
            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Cart not found' });
            }
            res.json({ success: true });
        } catch (error) {
            next(error);
        }
    },

    deleteCart: async (req, res) => {
        try {
            const { customerId, productId } = req.params;
            const affectedRows = await cartModel.delete(customerId, productId);
            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Cart not found' });
            }
            res.json({ success: true });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },
};

export default cartController;
