import express from 'express';
import saleEventController from '../controllers/saleEventController.js';
import { authenticateToken, requireAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authenticateToken, requireAdmin, saleEventController.getSaleEvents);
router.get('/:saleId', authenticateToken, requireAdmin, saleEventController.getSaleEventById);
router.post('/', authenticateToken, requireAdmin, saleEventController.createSaleEvent);
router.put('/:saleId', authenticateToken, requireAdmin, saleEventController.updateSaleEvent);
router.delete('/:saleId', authenticateToken, requireAdmin, saleEventController.deleteSaleEvent);

export default router;
