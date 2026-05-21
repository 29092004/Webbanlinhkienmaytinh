import express from 'express';
import productController from '../controllers/productController.js';
import { authenticateToken, requireAdmin } from '../middlewares/authMiddleware.js';
import { uploadProductAssets } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.get('/', productController.getProducts);
router.post(
    '/spec-preview',
    authenticateToken,
    requireAdmin,
    uploadProductAssets.fields([
        { name: 'specFile', maxCount: 1 },
    ]),
    productController.previewSpecificationFile
);
router.get('/:id', productController.getProductById);
router.post(
    '/',
    authenticateToken,
    requireAdmin,
    uploadProductAssets.fields([
        { name: 'images', maxCount: 3 },
        { name: 'specFile', maxCount: 1 },
    ]),
    productController.createProduct
);
router.put(
    '/:id',
    authenticateToken,
    requireAdmin,
    uploadProductAssets.fields([
        { name: 'images', maxCount: 3 },
        { name: 'specFile', maxCount: 1 },
    ]),
    productController.updateProduct
);
router.delete('/:id', authenticateToken, requireAdmin, productController.deleteProduct);

export default router;
