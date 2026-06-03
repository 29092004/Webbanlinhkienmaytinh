import express from 'express';
import customerController from '../controllers/customerController.js';
import {
    authenticateToken,
    requireAdmin,
    requireAdminOrStaff,
    requireAuthenticatedUser,
} from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authenticateToken, requireAdminOrStaff, customerController.getCustomers);
router.get('/:customerId', authenticateToken, requireAuthenticatedUser, customerController.getCustomerById);
router.post('/', authenticateToken, requireAdmin, customerController.createCustomer);
router.put('/:customerId', authenticateToken, requireAuthenticatedUser, customerController.updateCustomer);
router.delete('/:customerId', authenticateToken, requireAdmin, customerController.deleteCustomer);

export default router;
