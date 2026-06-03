import saleEventModel from '../models/saleEventModel.js';

const saleEventController = {
    getSaleEvents: async (req, res) => {
        try {
            const rows = await saleEventModel.getAll();
            res.json({ success: true, data: rows });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    getSaleEventById: async (req, res) => {
        try {
            const { saleId } = req.params;
            const row = await saleEventModel.getById(saleId);
            if (!row) {
                return res.status(404).json({ message: 'Sale event not found' });
            }
            res.json({ success: true, data: row });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    createSaleEvent: async (req, res, next) => {
        try {
            const saleType = req.body.saleType ?? req.body.sale_type;
            const saleValue = req.body.saleValue ?? req.body.sale_value;
            const saleDuration = req.body.saleDuration ?? req.body.sale_duration ?? 7;

            if (!saleType || saleValue === undefined) {
                return res.status(400).json({ message: 'Invalid input' });
            }

            const saleId = await saleEventModel.create(saleType, saleValue, saleDuration);
            res.status(201).json({ success: true, saleId });
        } catch (error) {
            next(error);
        }
    },

    updateSaleEvent: async (req, res, next) => {
        try {
            const { saleId } = req.params;
            const saleType = req.body.saleType ?? req.body.sale_type;
            const saleValue = req.body.saleValue ?? req.body.sale_value;
            const saleDuration = req.body.saleDuration ?? req.body.sale_duration ?? 7;

            if (!saleType || saleValue === undefined) {
                return res.status(400).json({ message: 'Invalid input' });
            }

            const affectedRows = await saleEventModel.update(saleId, saleType, saleValue, saleDuration);
            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Sale event not found' });
            }
            res.json({ success: true });
        } catch (error) {
            next(error);
        }
    },

    deleteSaleEvent: async (req, res) => {
        try {
            const { saleId } = req.params;
            const affectedRows = await saleEventModel.delete(saleId);
            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Sale event not found' });
            }
            res.json({ success: true });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },
};

export default saleEventController;
