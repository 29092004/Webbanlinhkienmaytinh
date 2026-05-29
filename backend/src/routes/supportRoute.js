import express from 'express';
import supportController from '../controllers/supportController.js';
import {
    authenticateToken,
    requireAdminOrStaff,
    requireAuthenticatedUser,
    requireUser,
} from '../middlewares/authMiddleware.js';
import { withSupportImageUpload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.get('/conversations/me', authenticateToken, requireUser, supportController.getCurrentConversation);
router.post('/conversations', authenticateToken, requireUser, withSupportImageUpload, supportController.sendUserMessage);
router.get('/conversations/admin', authenticateToken, requireAdminOrStaff, supportController.getAdminConversations);
router.get('/conversations/:conversationId/messages', authenticateToken, requireAuthenticatedUser, supportController.getConversationMessages);
router.post('/conversations/:conversationId/messages', authenticateToken, requireAdminOrStaff, withSupportImageUpload, supportController.sendAdminMessage);
router.patch('/conversations/:conversationId/read', authenticateToken, requireAuthenticatedUser, supportController.markConversationRead);

export default router;
