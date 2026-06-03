import express from 'express';
import productController from '../controllers/productController.js';
import { authenticateToken, requireAdmin } from '../middlewares/authMiddleware.js';
import { withUploadProductAssets, withUploadProductSpecPreview } from '../middleware/upload.js';

const router = express.Router();

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.post('/spec-preview', authenticateToken, requireAdmin, withUploadProductSpecPreview, productController.previewSpecificationFile);
router.post('/', authenticateToken, requireAdmin, withUploadProductAssets, productController.createProduct);
router.put('/:id', authenticateToken, requireAdmin, withUploadProductAssets, productController.updateProduct);
router.delete('/:id', authenticateToken, requireAdmin, productController.deleteProduct);

export default router;
