import accountModel from '../models/accountModel.js';
import customerModel from '../models/customerModel.js';
import SupportConversation from '../models/supportConversationModel.js';

const isAdminRole = (role) => role === 'admin' || role === 'staff';

const buildDisplayName = (customer, account) => {
    const fullName = [customer?.firstName, customer?.lastName]
        .map((value) => String(value || '').trim())
        .filter(Boolean)
        .join(' ')
        .trim();

    return fullName || account?.username || 'Khách hàng';
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
        accountId: Number(account.id),
        username: account.username || '',
        displayName: buildDisplayName(customer, account),
        email: customer?.email || account.username || '',
        phone: customer?.phone || '',
    };
};

const toConversationSummary = (conversation) => ({
    id: conversation._id.toString(),
    participant: conversation.participant,
    assignedAdmin: conversation.assignedAdmin,
    lastMessagePreview: conversation.lastMessagePreview,
    lastMessageAt: conversation.lastMessageAt,
    lastSenderRole: conversation.lastSenderRole,
    unreadForAdmin: conversation.unreadForAdmin,
    unreadForUser: conversation.unreadForUser,
    messageCount: conversation.messages.length,
});

const toMessagePayload = (message) => ({
    id: message._id.toString(),
    senderRole: message.senderRole,
    senderId: message.senderId,
    senderName: message.senderName,
    content: message.content,
    imageUrl: message.imageUrl,
    imageName: message.imageName,
    imageMimeType: message.imageMimeType,
    createdAt: message.createdAt,
    readByAdminAt: message.readByAdminAt,
    readByUserAt: message.readByUserAt,
});

const ensureConversationAccess = (conversation, user) => {
    if (!conversation) {
        return { allowed: false, status: 404, message: 'Conversation not found' };
    }

    if (isAdminRole(user.role)) {
        return { allowed: true };
    }

    if (conversation.participant.accountId !== Number(user.id)) {
        return { allowed: false, status: 403, message: 'Forbidden' };
    }

    return { allowed: true };
};

const createMessagePayload = ({ senderRole, senderId, senderName, content }) => ({
    senderRole,
    senderId,
    senderName,
    content,
    readByAdminAt: isAdminRole(senderRole) ? new Date() : null,
    readByUserAt: senderRole === 'user' ? new Date() : null,
});

const appendSupportImageData = (file) => {
    if (!file) {
        return {
            imageUrl: '',
            imageName: '',
            imageMimeType: '',
        };
    }

    return {
        imageUrl: `/uploads/support/${file.filename}`,
        imageName: file.originalname || file.filename,
        imageMimeType: file.mimetype || '',
    };
};

const buildMessageDocument = ({ senderRole, senderId, senderName, content, image }) => ({
    ...createMessagePayload({
        senderRole,
        senderId,
        senderName,
        content,
    }),
    ...appendSupportImageData(image),
});

const supportController = {
    getCurrentConversation: async (req, res, next) => {
        try {
            if (isAdminRole(req.user.role)) {
                return res.status(403).json({ message: 'Forbidden' });
            }

            const conversation = await SupportConversation.findOne({
                'participant.accountId': Number(req.user.id),
            }).lean();

            return res.json({
                success: true,
                data: conversation ? toConversationSummary(conversation) : null,
            });
        } catch (error) {
            next(error);
        }
    },

    getAdminConversations: async (req, res, next) => {
        try {
            const conversations = await SupportConversation.find({})
                .sort({ lastMessageAt: -1 })
                .lean();

            const items = conversations.map(toConversationSummary);
            const pendingMessages = items.reduce(
                (total, conversation) => total + Number(conversation.unreadForAdmin || 0),
                0
            );
            const waitingCustomers = items.filter(
                (conversation) => Number(conversation.unreadForAdmin || 0) > 0
            ).length;

            return res.json({
                success: true,
                data: items,
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
            const conversation = await SupportConversation.findById(req.params.conversationId);
            const access = ensureConversationAccess(conversation, req.user);

            if (!access.allowed) {
                return res.status(access.status).json({ message: access.message });
            }

            return res.json({
                success: true,
                data: {
                    conversation: toConversationSummary(conversation),
                    messages: conversation.messages.map(toMessagePayload),
                },
            });
        } catch (error) {
            next(error);
        }
    },

    sendUserMessage: async (req, res, next) => {
        try {
            if (isAdminRole(req.user.role)) {
                return res.status(403).json({ message: 'Forbidden' });
            }

            const content = String(req.body.content || '').trim();
            const image = req.file || null;

            if (!content && !image) {
                return res.status(400).json({ message: 'Message content or image is required' });
            }

            const participant = await getParticipantProfile(Number(req.user.id));

            if (!participant) {
                return res.status(404).json({ message: 'Account not found' });
            }

            const message = buildMessageDocument({
                senderRole: 'user',
                senderId: participant.accountId,
                senderName: participant.displayName,
                content,
                image,
            });
            const sentAt = new Date();

            const conversation = await SupportConversation.findOneAndUpdate(
                {
                    'participant.accountId': participant.accountId,
                },
                {
                    $set: {
                        participant,
                        lastMessagePreview: content || (image ? 'Da gui mot hinh anh' : ''),
                        lastMessageAt: sentAt,
                        lastSenderRole: 'user',
                        unreadForUser: 0,
                    },
                    $inc: {
                        unreadForAdmin: 1,
                    },
                    $push: {
                        messages: message,
                    },
                },
                {
                    returnDocument: 'after',
                    upsert: true,
                    runValidators: true,
                    setDefaultsOnInsert: true,
                }
            );

            console.log(
                '[support] user message saved',
                JSON.stringify({
                    conversationId: conversation._id.toString(),
                    participantAccountId: participant.accountId,
                    messageCount: conversation.messages.length,
                    lastMessagePreview: conversation.lastMessagePreview,
                })
            );

            return res.status(201).json({
                success: true,
                data: {
                    conversation: toConversationSummary(conversation),
                    message: toMessagePayload(conversation.messages[conversation.messages.length - 1]),
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

            const content = String(req.body.content || '').trim();
            const image = req.file || null;

            if (!content && !image) {
                return res.status(400).json({ message: 'Message content or image is required' });
            }

            const existingConversation = await SupportConversation.findById(req.params.conversationId);

            if (!existingConversation) {
                return res.status(404).json({ message: 'Conversation not found' });
            }

            const account = await accountModel.getById(req.user.id);
            const senderName = account?.username || 'Nhân viên hỗ trợ';
            const senderRole = req.user.role === 'staff' ? 'staff' : 'admin';

            const message = buildMessageDocument({
                senderRole,
                senderId: Number(req.user.id),
                senderName,
                content,
                image,
            });
            const sentAt = new Date();

            const conversation = await SupportConversation.findByIdAndUpdate(
                req.params.conversationId,
                {
                    $set: {
                        lastMessagePreview: content || (image ? 'Da gui mot hinh anh' : ''),
                        lastMessageAt: sentAt,
                        lastSenderRole: senderRole,
                        unreadForAdmin: 0,
                        assignedAdmin: {
                            accountId: Number(req.user.id),
                            username: account?.username || '',
                            role: senderRole,
                        },
                    },
                    $inc: {
                        unreadForUser: 1,
                    },
                    $push: {
                        messages: message,
                    },
                },
                {
                    returnDocument: 'after',
                    runValidators: true,
                }
            );

            console.log(
                '[support] admin message saved',
                JSON.stringify({
                    conversationId: conversation._id.toString(),
                    adminAccountId: Number(req.user.id),
                    messageCount: conversation.messages.length,
                    lastMessagePreview: conversation.lastMessagePreview,
                })
            );

            return res.status(201).json({
                success: true,
                data: {
                    conversation: toConversationSummary(conversation),
                    message: toMessagePayload(conversation.messages[conversation.messages.length - 1]),
                },
            });
        } catch (error) {
            next(error);
        }
    },

    markConversationRead: async (req, res, next) => {
        try {
            const conversation = await SupportConversation.findById(req.params.conversationId);
            const access = ensureConversationAccess(conversation, req.user);

            if (!access.allowed) {
                return res.status(access.status).json({ message: access.message });
            }

            const now = new Date();

            if (isAdminRole(req.user.role)) {
                conversation.unreadForAdmin = 0;
                conversation.messages.forEach((message) => {
                    if (!message.readByAdminAt) {
                        message.readByAdminAt = now;
                    }
                });
                conversation.assignedAdmin = conversation.assignedAdmin?.accountId
                    ? conversation.assignedAdmin
                    : {
                          accountId: Number(req.user.id),
                          username: '',
                          role: req.user.role,
                      };
            } else {
                conversation.unreadForUser = 0;
                conversation.messages.forEach((message) => {
                    if (!message.readByUserAt) {
                        message.readByUserAt = now;
                    }
                });
            }

            await conversation.save();

            return res.json({
                success: true,
                data: toConversationSummary(conversation),
            });
        } catch (error) {
            next(error);
        }
    },
};

export default supportController;
