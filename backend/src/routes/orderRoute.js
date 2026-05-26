import express from 'express';
import orderController from '../controllers/orderController.js';
import {
    authenticateToken,
    requireAdmin,
    requireAdminOrStaff,
    requireAuthenticatedUser,
    requireRole,
} from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authenticateToken, requireAuthenticatedUser, orderController.getOrders);
router.get('/:id', authenticateToken, requireRole('admin', 'staff', 'user'), orderController.getOrderById);
router.post('/', authenticateToken, requireRole('admin', 'user'), orderController.createOrder);
router.put('/:id', authenticateToken, requireAdminOrStaff, orderController.updateOrder);
router.delete('/:id', authenticateToken, requireAdmin, orderController.deleteOrder);

export default router;
