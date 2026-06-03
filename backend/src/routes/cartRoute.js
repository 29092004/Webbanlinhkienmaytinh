import express from 'express';
import cartController from '../controllers/cartController.js';
import {
    authenticateToken,
    requireAdminOrStaff,
    requireAuthenticatedUser,
    requireUser,
} from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authenticateToken, requireAdminOrStaff, cartController.getCarts);
router.get('/customer/:customerId', authenticateToken, requireAuthenticatedUser, cartController.getCartsByCustomerId);
router.get('/:id', authenticateToken, requireAuthenticatedUser, cartController.getCartById);
router.post('/', authenticateToken, requireUser, cartController.createCart);
router.put('/:id', authenticateToken, requireUser, cartController.updateCart);
router.delete('/:id', authenticateToken, requireAuthenticatedUser, cartController.deleteCart);

export default router;
