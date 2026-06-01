import accountModel from '../models/accountModel.js';
import customerModel from '../models/customerModel.js';
import SupportModel from '../models/supportModel.js';

const isAdminRole = (role) => role === 'admin' || role === 'staff';

const ensureUserConversationRole = (role) => role === 'user' || role === 'customer';

const ensureConversationAccess = (conversation, user) => {
    if (!conversation) {
        return { allowed: false, status: 404, message: 'Conversation not found' };
    }

    if (isAdminRole(user.role)) {
        return { allowed: true };
    }

    if (!ensureUserConversationRole(user.role) || Number(conversation.customer_id) !== Number(user.id)) {
        return { allowed: false, status: 403, message: 'Forbidden' };
    }

    return { allowed: true };
};

const canRecallMessage = ({ message, user }) => {
    if (!message) {
        return { allowed: false, status: 404, message: 'Message not found' };
    }

    const role = user.role === 'user' ? 'customer' : user.role;
    const senderMatches = Number(message.sender_id) === Number(user.id);
    const typeMatches = message.sender_type === role;

    if (!senderMatches || !typeMatches) {
        return { allowed: false, status: 403, message: 'Bạn chỉ có thể thu hồi tin nhắn của chính mình' };
    }

    return { allowed: true };
};

const getParticipantProfile = async (accountId) => {
    const [account, customer] = await Promise.all([
        accountModel.getById(accountId),
        customerModel.getById(accountId),
    ]);

    if (!account) {
        return null;
    }

    return {
        account,
        customer,
    };
};

const supportController = {
    getCurrentConversation: async (req, res, next) => {
        try {
            if (!ensureUserConversationRole(req.user.role)) {
                return res.status(403).json({ message: 'Forbidden' });
            }

            const conversation = await SupportModel.getConversationSummaryByCustomerId(Number(req.user.id));

            return res.json({
                success: true,
                data: conversation,
            });
        } catch (error) {
            next(error);
        }
    },

    getAdminConversations: async (req, res, next) => {
        try {
            const conversations = await SupportModel.getAdminConversationSummaries();
            const pendingMessages = conversations.reduce(
                (total, conversation) => total + Number(conversation.unreadForAdmin || 0),
                0
            );
            const waitingCustomers = conversations.filter(
                (conversation) => Number(conversation.unreadForAdmin || 0) > 0
            ).length;

            return res.json({
                success: true,
                data: conversations,
                meta: {
                    pendingMessages,
                    waitingCustomers,
                },
            });
        } catch (error) {
            next(error);
        }
    },

    getConversationMessages: async (req, res, next) => {
        try {
            const conversationId = Number(req.params.conversationId);
            const conversationAccess = await SupportModel.getConversationAccessById(conversationId);
            const access = ensureConversationAccess(conversationAccess, req.user);

            if (!access.allowed) {
                return res.status(access.status).json({ message: access.message });
            }

            const [conversation, messages] = await Promise.all([
                SupportModel.getConversationSummaryById(conversationId),
                SupportModel.getMessagesByConversationId(conversationId),
            ]);

            return res.json({
                success: true,
                data: {
                    conversation,
                    messages,
                },
            });
        } catch (error) {
            next(error);
        }
    },

    sendUserMessage: async (req, res, next) => {
        try {
            if (!ensureUserConversationRole(req.user.role)) {
                return res.status(403).json({ message: 'Forbidden' });
            }

            const content = String(req.body.content || '').trim();
            const image = req.file || null;

            if (!content && !image) {
                return res.status(400).json({ message: 'Message content or image is required' });
            }

            const participant = await getParticipantProfile(Number(req.user.id));
            if (!participant?.account) {
                return res.status(404).json({ message: 'Account not found' });
            }

            const conversationId = await SupportModel.upsertUserConversationMessage({
                customerId: Number(req.user.id),
                content,
                image,
            });

            const [conversation, messages] = await Promise.all([
                SupportModel.getConversationSummaryById(conversationId),
                SupportModel.getMessagesByConversationId(conversationId),
            ]);

            return res.status(201).json({
                success: true,
                data: {
                    conversation,
                    message: messages[messages.length - 1] || null,
                },
            });
        } catch (error) {
            next(error);
        }
    },

    sendAdminMessage: async (req, res, next) => {
        try {
            if (!isAdminRole(req.user.role)) {
                return res.status(403).json({ message: 'Forbidden' });
            }

            const conversationId = Number(req.params.conversationId);
            const content = String(req.body.content || '').trim();
            const image = req.file || null;

            if (!content && !image) {
                return res.status(400).json({ message: 'Message content or image is required' });
            }

            const conversationAccess = await SupportModel.getConversationAccessById(conversationId);
            if (!conversationAccess) {
                return res.status(404).json({ message: 'Conversation not found' });
            }

            await SupportModel.createAdminConversationMessage({
                conversationId,
                senderId: Number(req.user.id),
                senderType: req.user.role === 'staff' ? 'staff' : 'admin',
                content,
                image,
            });

            const [conversation, messages] = await Promise.all([
                SupportModel.getConversationSummaryById(conversationId),
                SupportModel.getMessagesByConversationId(conversationId),
            ]);

            return res.status(201).json({
                success: true,
                data: {
                    conversation,
                    message: messages[messages.length - 1] || null,
                },
            });
        } catch (error) {
            next(error);
        }
    },

    markConversationRead: async (req, res, next) => {
        try {
            const conversationId = Number(req.params.conversationId);
            const conversationAccess = await SupportModel.getConversationAccessById(conversationId);
            const access = ensureConversationAccess(conversationAccess, req.user);

            if (!access.allowed) {
                return res.status(access.status).json({ message: access.message });
            }

            if (isAdminRole(req.user.role)) {
                await SupportModel.markConversationReadForAdmin(conversationId);
            } else {
                await SupportModel.markConversationReadForUser(conversationId);
            }

            const conversation = await SupportModel.getConversationSummaryById(conversationId);

            return res.json({
                success: true,
                data: conversation,
            });
        } catch (error) {
            next(error);
        }
    },

    deleteMessage: async (req, res, next) => {
        try {
            const conversationId = Number(req.params.conversationId);
            const messageId = Number(req.params.messageId);
            const conversationAccess = await SupportModel.getConversationAccessById(conversationId);
            const access = ensureConversationAccess(conversationAccess, req.user);

            if (!access.allowed) {
                return res.status(access.status).json({ message: access.message });
            }

            const messageAccess = await SupportModel.getMessageAccessById({ conversationId, messageId });
            const messagePermission = canRecallMessage({ message: messageAccess, user: req.user });

            if (!messagePermission.allowed) {
                return res.status(messagePermission.status).json({ message: messagePermission.message });
            }

            const affectedRows = await SupportModel.deleteMessageById({ conversationId, messageId });

            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Message not found' });
            }

            const [conversation, messages] = await Promise.all([
                SupportModel.getConversationSummaryById(conversationId),
                SupportModel.getMessagesByConversationId(conversationId),
            ]);

            return res.json({
                success: true,
                data: {
                    conversation,
                    messages,
                    deletedMessageId: String(messageId),
                },
            });
        } catch (error) {
            next(error);
        }
    },
};

export default supportController;
