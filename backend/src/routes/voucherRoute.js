import express from 'express';
import voucherController from '../controllers/voucherController.js';

const router = express.Router();

router.get('/', voucherController.getVouchers);
router.get('/:id', voucherController.getVoucherById);
router.post('/', voucherController.createVoucher);
router.put('/:id', voucherController.updateVoucher);
router.delete('/:id', voucherController.deleteVoucher);

export default router;
