import cartModel from '../models/cartModel.js';

const normalizeCartItems = (value, fallbackProductId = null, fallbackQuantity = null) => {
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

    if (fallbackProductId && fallbackQuantity !== null && fallbackQuantity !== undefined) {
        return [{
            productId: fallbackProductId,
            quantity: fallbackQuantity,
        }];
    }

    return [];
};

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
            const { id } = req.params;
            const row = await cartModel.getById(id);
            if (!row) {
                return res.status(404).json({ message: 'Cart not found' });
            }
            res.json({ success: true, data: row });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    getCartsByCustomerId: async (req, res) => {
        try {
            const { customerId } = req.params;
            const rows = await cartModel.getByCustomerId(customerId);
            res.json({ success: true, data: rows });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    createCart: async (req, res, next) => {
        try {
            const customerId = req.body.customerId ?? req.body.customer_id;
            const createdAt = req.body.createdAt ?? req.body.created_at ?? null;
            const productId = req.body.productId ?? req.body.product_id ?? null;
            const quantity = req.body.quantity ?? null;
            const items = normalizeCartItems(req.body.items, productId, quantity);

            if (!customerId) {
                return res.status(400).json({ message: 'customerId is required' });
            }

            const cartId = await cartModel.create(customerId, createdAt, items);
            res.status(201).json({ success: true, cartId });
        } catch (error) {
            next(error);
        }
    },

    updateCart: async (req, res, next) => {
        try {
            const { id } = req.params;
            const customerId = req.body.customerId ?? req.body.customer_id;
            const createdAt = req.body.createdAt ?? req.body.created_at ?? null;
            const productId = req.body.productId ?? req.body.product_id ?? null;
            const quantity = req.body.quantity ?? null;
            const items = normalizeCartItems(req.body.items, productId, quantity);

            if (!customerId) {
                return res.status(400).json({ message: 'customerId is required' });
            }

            const affectedRows = await cartModel.update(id, customerId, createdAt, items);
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
            const { id } = req.params;
            const affectedRows = await cartModel.delete(id);
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
