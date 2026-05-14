import express from 'express';
import cartController from '../controllers/cartController.js';

const router = express.Router();

router.get('/', cartController.getCarts);
router.get('/:customerId/:productId', cartController.getCartById);
router.post('/', cartController.createCart);
router.put('/:customerId/:productId', cartController.updateCart);
router.delete('/:customerId/:productId', cartController.deleteCart);

export default router;
