import supplierModel from '../models/supplierModel.js';

const supplierController = {
    getSuppliers: async (req, res) => {
        try {
            const rows = await supplierModel.getAll();
            res.json({ success: true, data: rows });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    getSupplierById: async (req, res) => {
        try {
            const { id } = req.params;
            const row = await supplierModel.getById(id);
            if (!row) {
                return res.status(404).json({ message: 'Supplier not found' });
            }
            res.json({ success: true, data: row });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    createSupplier: async (req, res, next) => {
        try {
            const { name, phonenumber, email, address } = req.body;
            if (!name || !phonenumber || !email || !address) {
                return res.status(400).json({ message: 'Invalid input' });
            }
            const supplierId = await supplierModel.create(name, phonenumber, email, address);
            res.status(201).json({ success: true, supplierId });
        } catch (error) {
            next(error);
        }
    },

    updateSupplier: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { name, phonenumber, email, address } = req.body;
            if (!name || !phonenumber || !email || !address) {
                return res.status(400).json({ message: 'Invalid input' });
            }
            const affectedRows = await supplierModel.update(id, name, phonenumber, email, address);
            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Supplier not found' });
            }
            res.json({ success: true });
        } catch (error) {
            next(error);
        }
    },

    deleteSupplier: async (req, res) => {
        try {
            const { id } = req.params;
            const affectedRows = await supplierModel.delete(id);
            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Supplier not found' });
            }
            res.json({ success: true });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },
};

export default supplierController;
