import categoryModel from '../models/categoryModel.js';

const categoryController = {
    getCategories: async (req, res) => {
        try {
            const rows = await categoryModel.getAll();
            res.json({ success: true, data: rows });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    getCategoryById: async (req, res) => {
        try {
            const { id } = req.params;
            const row = await categoryModel.getById(id);
            if (!row) {
                return res.status(404).json({ message: 'Category not found' });
            }
            res.json({ success: true, data: row });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    createCategory: async (req, res, next) => {
        try {
            const { name } = req.body;
            if (!name) {
                return res.status(400).json({ message: 'Category name is required' });
            }
            const categoryId = await categoryModel.create(name);
            res.status(201).json({ success: true, categoryId });
        } catch (error) {
            next(error);
        }
    },

    updateCategory: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { name } = req.body;
            if (!name) {
                return res.status(400).json({ message: 'Category name is required' });
            }
            const affectedRows = await categoryModel.update(id, name);
            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Category not found' });
            }
            res.json({ success: true });
        } catch (error) {
            next(error);
        }
    },

    deleteCategory: async (req, res) => {
        try {
            const { id } = req.params;
            const affectedRows = await categoryModel.delete(id);
            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Category not found' });
            }
            res.json({ success: true });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },
};

export default categoryController;
