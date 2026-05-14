import express from 'express';
import shippingController from '../controllers/shippingController.js';

const router = express.Router();

router.get('/', shippingController.getShippings);
router.get('/:id', shippingController.getShippingById);
router.post('/', shippingController.createShipping);
router.put('/:id', shippingController.updateShipping);
router.delete('/:id', shippingController.deleteShipping);

export default router;
