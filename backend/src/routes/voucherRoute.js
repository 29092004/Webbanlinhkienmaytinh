import express from 'express';
import voucherController from '../controllers/voucherController.js';
import { authenticateToken, requireAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', voucherController.getVouchers);
router.get('/:id', voucherController.getVoucherById);
router.post('/', authenticateToken, requireAdmin, voucherController.createVoucher);
router.put('/:id', authenticateToken, requireAdmin, voucherController.updateVoucher);
router.delete('/:id', authenticateToken, requireAdmin, voucherController.deleteVoucher);

export default router;
