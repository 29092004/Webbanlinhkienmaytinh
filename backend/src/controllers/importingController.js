import importingModel from '../models/importingModel.js';

const normalizeImportingDetails = (value, fallbackProductId = null, fallbackQuantity = null, fallbackSubtotalPrice = null) => {
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
            subtotalPrice: fallbackSubtotalPrice,
        }];
    }

    return [];
};

const importingController = {
    getImportings: async (req, res) => {
        try {
            const rows = await importingModel.getAll();
            res.json({ success: true, data: rows });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    getImportingById: async (req, res) => {
        try {
            const { id } = req.params;
            const row = await importingModel.getById(id);
            if (!row) {
                return res.status(404).json({ message: 'Importing not found' });
            }
            res.json({ success: true, data: row });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    createImporting: async (req, res, next) => {
        try {
            const { date } = req.body;
            const totalPrice = req.body.totalPrice ?? req.body.total_price;
            const supplierId = req.body.supplierId ?? req.body.id_supplier;
            const productId = req.body.productId ?? req.body.id_product ?? null;
            const quantity = req.body.quantity ?? null;
            const subtotalPrice = req.body.subtotalPrice ?? req.body.subtotalprice ?? null;
            const details = normalizeImportingDetails(req.body.details, productId, quantity, subtotalPrice);

            if (!date || totalPrice === undefined || !supplierId) {
                return res.status(400).json({ message: 'Invalid input' });
            }

            const importingId = await importingModel.create(date, totalPrice, supplierId, details);
            res.status(201).json({ success: true, importingId });
        } catch (error) {
            next(error);
        }
    },

    updateImporting: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { date } = req.body;
            const totalPrice = req.body.totalPrice ?? req.body.total_price;
            const supplierId = req.body.supplierId ?? req.body.id_supplier;
            const productId = req.body.productId ?? req.body.id_product ?? null;
            const quantity = req.body.quantity ?? null;
            const subtotalPrice = req.body.subtotalPrice ?? req.body.subtotalprice ?? null;
            const details = normalizeImportingDetails(req.body.details, productId, quantity, subtotalPrice);

            if (!date || totalPrice === undefined || !supplierId) {
                return res.status(400).json({ message: 'Invalid input' });
            }

            const affectedRows = await importingModel.update(id, date, totalPrice, supplierId, details);
            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Importing not found' });
            }
            res.json({ success: true });
        } catch (error) {
            next(error);
        }
    },

    deleteImporting: async (req, res) => {
        try {
            const { id } = req.params;
            const affectedRows = await importingModel.delete(id);
            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Importing not found' });
            }
            res.json({ success: true });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },
};

export default importingController;
