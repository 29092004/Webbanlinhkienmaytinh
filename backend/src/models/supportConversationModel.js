import mongoose from '../config/mongo.js';

const supportMessageSchema = new mongoose.Schema(
    {
        senderRole: {
            type: String,
            enum: ['user', 'admin', 'staff'],
            required: true,
        },
        senderId: {
            type: Number,
            required: true,
        },
        senderName: {
            type: String,
            trim: true,
            default: '',
        },
        content: {
            type: String,
            trim: true,
            default: '',
            maxlength: 2000,
        },
        imageUrl: {
            type: String,
            trim: true,
            default: '',
        },
        imageName: {
            type: String,
            trim: true,
            default: '',
        },
        imageMimeType: {
            type: String,
            trim: true,
            default: '',
        },
        readByAdminAt: {
            type: Date,
            default: null,
        },
        readByUserAt: {
            type: Date,
            default: null,
        },
    },
    {
        _id: true,
        timestamps: {
            createdAt: true,
            updatedAt: false,
        },
    }
);

const supportConversationSchema = new mongoose.Schema(
    {
        participant: {
            accountId: {
                type: Number,
                required: true,
                unique: true,
                index: true,
            },
            username: {
                type: String,
                trim: true,
                default: '',
            },
            displayName: {
                type: String,
                trim: true,
                default: '',
            },
            email: {
                type: String,
                trim: true,
                default: '',
            },
            phone: {
                type: String,
                trim: true,
                default: '',
            },
        },
        assignedAdmin: {
            accountId: {
                type: Number,
                default: null,
            },
            username: {
                type: String,
                trim: true,
                default: '',
            },
            role: {
                type: String,
                trim: true,
                default: '',
            },
        },
        lastMessagePreview: {
            type: String,
            trim: true,
            default: '',
        },
        lastMessageAt: {
            type: Date,
            default: Date.now,
            index: true,
        },
        lastSenderRole: {
            type: String,
            enum: ['user', 'admin', 'staff'],
            default: 'user',
        },
        unreadForAdmin: {
            type: Number,
            default: 0,
            min: 0,
        },
        unreadForUser: {
            type: Number,
            default: 0,
            min: 0,
        },
        messages: {
            type: [supportMessageSchema],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

const SupportConversation =
    mongoose.models.SupportConversation ||
    mongoose.model('SupportConversation', supportConversationSchema);

export default SupportConversation;
