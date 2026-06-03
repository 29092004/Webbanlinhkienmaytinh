import express from 'express';
import categoryController from '../controllers/categoryController.js';
import { authenticateToken, requireAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategoryById);
router.post('/', authenticateToken, requireAdmin, categoryController.createCategory);
router.put('/:id', authenticateToken, requireAdmin, categoryController.updateCategory);
router.delete('/:id', authenticateToken, requireAdmin, categoryController.deleteCategory);

export default router;
