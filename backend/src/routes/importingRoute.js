import express from 'express';
import importingController from '../controllers/importingController.js';

const router = express.Router();

router.get('/', importingController.getImportings);
router.get('/:id', importingController.getImportingById);
router.post('/', importingController.createImporting);
router.put('/:id', importingController.updateImporting);
router.delete('/:id', importingController.deleteImporting);

export default router;
