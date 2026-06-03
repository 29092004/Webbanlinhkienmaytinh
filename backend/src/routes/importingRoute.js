import express from 'express';
import importingController from '../controllers/importingController.js';
import { authenticateToken, requireAdminOrStaff } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authenticateToken, requireAdminOrStaff, importingController.getImportings);
router.get('/:id', authenticateToken, requireAdminOrStaff, importingController.getImportingById);
router.post('/', authenticateToken, requireAdminOrStaff, importingController.createImporting);
router.put('/:id', authenticateToken, requireAdminOrStaff, importingController.updateImporting);
router.delete('/:id', authenticateToken, requireAdminOrStaff, importingController.deleteImporting);

export default router;
