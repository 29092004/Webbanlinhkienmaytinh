import express from 'express';
import supplierController from '../controllers/supplierController.js';
import { authenticateToken, requireAdminOrStaff } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authenticateToken, requireAdminOrStaff, supplierController.getSuppliers);
router.get('/:id', authenticateToken, requireAdminOrStaff, supplierController.getSupplierById);
router.post('/', authenticateToken, requireAdminOrStaff, supplierController.createSupplier);
router.put('/:id', authenticateToken, requireAdminOrStaff, supplierController.updateSupplier);
router.delete('/:id', authenticateToken, requireAdminOrStaff, supplierController.deleteSupplier);

export default router;
