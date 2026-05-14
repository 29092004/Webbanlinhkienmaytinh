import express from 'express';
import brandController from '../controllers/brandController.js';

const router = express.Router();

router.get('/', brandController.getBrands);
router.get('/:brandId', brandController.getBrandById);
router.post('/', brandController.createBrand);
router.put('/:brandId', brandController.updateBrand);
router.delete('/:brandId', brandController.deleteBrand);

export default router;
