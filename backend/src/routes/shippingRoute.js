import express from 'express';
import shippingController from '../controllers/shippingController.js';
import {
    authenticateToken,
    requireAdmin,
    requireAdminOrStaff,
} from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authenticateToken, requireAdminOrStaff, shippingController.getShippings);
router.get('/:id', authenticateToken, requireAdminOrStaff, shippingController.getShippingById);
router.post('/', authenticateToken, requireAdminOrStaff, shippingController.createShipping);
router.put('/:id', authenticateToken, requireAdminOrStaff, shippingController.updateShipping);
router.delete('/:id', authenticateToken, requireAdmin, shippingController.deleteShipping);

export default router;
