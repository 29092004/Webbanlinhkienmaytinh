import express from 'express';
import brandController from '../controllers/brandController.js';
import { authenticateToken, requireAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', brandController.getBrands);
router.get('/:brandId', brandController.getBrandById);
router.post('/', authenticateToken, requireAdmin, brandController.createBrand);
router.put('/:brandId', authenticateToken, requireAdmin, brandController.updateBrand);
router.delete('/:brandId', authenticateToken, requireAdmin, brandController.deleteBrand);

export default router;
