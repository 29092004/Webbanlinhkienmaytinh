import brandModel from '../models/brandModel.js';

const brandController = {
    getBrands: async (req, res) => {
        try {
            const rows = await brandModel.getAll();
            res.json({ success: true, data: rows });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    getBrandById: async (req, res) => {
        try {
            const { brandId } = req.params;
            const row = await brandModel.getById(brandId);
            if (!row) {
                return res.status(404).json({ message: 'Brand not found' });
            }
            res.json({ success: true, data: row });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    createBrand: async (req, res, next) => {
        try {
            const brandName = req.body.brandName ?? req.body.brand_name;
            if (!brandName) {
                return res.status(400).json({ message: 'Brand name is required' });
            }
            const brandId = await brandModel.create(brandName);
            res.status(201).json({ success: true, brandId });
        } catch (error) {
            next(error);
        }
    },

    updateBrand: async (req, res, next) => {
        try {
            const { brandId } = req.params;
            const brandName = req.body.brandName ?? req.body.brand_name;
            if (!brandName) {
                return res.status(400).json({ message: 'Brand name is required' });
            }
            const affectedRows = await brandModel.update(brandId, brandName);
            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Brand not found' });
            }
            res.json({ success: true });
        } catch (error) {
            next(error);
        }
    },

    deleteBrand: async (req, res) => {
        try {
            const { brandId } = req.params;
            const affectedRows = await brandModel.delete(brandId);
            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Brand not found' });
            }
            res.json({ success: true });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },
};

export default brandController;
