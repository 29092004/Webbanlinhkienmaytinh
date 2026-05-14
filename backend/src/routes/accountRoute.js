import express from 'express';
import accountController from '../controllers/accountController.js';
import { authenticateToken, requireAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authenticateToken, requireAdmin, accountController.getAccounts);
router.get('/:id', authenticateToken, requireAdmin, accountController.getAccountById);
router.post('/', authenticateToken, requireAdmin, accountController.createAccount);
router.put('/:id', authenticateToken, requireAdmin, accountController.updateAccount);
router.delete('/:id', authenticateToken, requireAdmin, accountController.deleteAccount);

export default router;
