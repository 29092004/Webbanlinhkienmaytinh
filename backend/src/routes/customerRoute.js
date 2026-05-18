import express from 'express';
import customerController from '../controllers/customerController.js';
import { authenticateToken, requireAdmin, requireUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', customerController.getCustomers);
router.get('/:customerId', authenticateToken, requireUser, customerController.getCustomerById);
router.post('/', authenticateToken, requireUser, customerController.createCustomer);
router.put('/:customerId', authenticateToken, requireUser, customerController.updateCustomer);
router.delete('/:customerId', authenticateToken, requireAdmin, customerController.deleteCustomer);

export default router;
