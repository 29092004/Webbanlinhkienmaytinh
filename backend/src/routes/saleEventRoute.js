import express from 'express';
import saleEventController from '../controllers/saleEventController.js';

const router = express.Router();

router.get('/', saleEventController.getSaleEvents);
router.get('/:saleId', saleEventController.getSaleEventById);
router.post('/', saleEventController.createSaleEvent);
router.put('/:saleId', saleEventController.updateSaleEvent);
router.delete('/:saleId', saleEventController.deleteSaleEvent);

export default router;
