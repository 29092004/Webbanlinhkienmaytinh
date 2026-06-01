import db from '../config/mysql.js';

const CONVERSATION_TABLE_SQL = `
    CREATE TABLE IF NOT EXISTS conversation (
        conversation_id INT PRIMARY KEY AUTO_INCREMENT,
        customer_id INT NOT NULL,
        staff_id INT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        last_message_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50) NOT NULL DEFAULT 'open',
        UNIQUE KEY uq_conversation_customer (customer_id),
        CONSTRAINT fk_conversation_customer FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON DELETE CASCADE,
        CONSTRAINT fk_conversation_staff FOREIGN KEY (staff_id) REFERENCES account(id) ON DELETE SET NULL
    )
`;

const MESSAGE_TABLE_SQL = `
    CREATE TABLE IF NOT EXISTS message (
        message_id INT PRIMARY KEY AUTO_INCREMENT,
        conversation_id INT NOT NULL,
        sender_id INT NOT NULL,
        sender_type VARCHAR(20) NOT NULL,
        content TEXT,
        message_type VARCHAR(20) NOT NULL DEFAULT 'text',
        image_url TEXT NULL,
        image_data MEDIUMBLOB NULL,
        image_name VARCHAR(255) NULL,
        image_mime_type VARCHAR(100) NULL,
        is_read TINYINT(1) NOT NULL DEFAULT 0,
        is_deleted TINYINT(1) NOT NULL DEFAULT 0,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        KEY idx_message_conversation_created (conversation_id, created_at, message_id),
        KEY idx_message_conversation_read (conversation_id, is_read, sender_type),
        CONSTRAINT fk_message_conversation FOREIGN KEY (conversation_id) REFERENCES conversation(conversation_id) ON DELETE CASCADE
    )
`;

let ensureSupportTablesPromise = null;

const ensureColumnExists = async ({ tableName, columnName, definition }) => {
    const [rows] = await db.query(
        `
            SELECT COUNT(*) AS total
            FROM information_schema.COLUMNS
            WHERE TABLE_SCHEMA = DATABASE()
                AND TABLE_NAME = ?
                AND COLUMN_NAME = ?
        `,
        [tableName, columnName]
    );

    if (Number(rows[0]?.total || 0) === 0) {
        await db.query(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`);
    }
};

const getLastMessagePreview = (row) => {
    if (row.last_content && String(row.last_content).trim()) {
        return row.last_content;
    }

    if (row.last_image_url || row.last_image_data) {
        return 'Đã gửi một hình ảnh';
    }

    return '';
};

const buildConversationSummaryQuery = (whereClause = '') => `
    SELECT
        conv.conversation_id,
        conv.customer_id,
        conv.staff_id,
        conv.created_at,
        conv.last_message_at,
        conv.status,
        customer_account.username AS participant_username,
        customer.first_name,
        customer.last_name,
        customer.email AS participant_email,
        customer.phone AS participant_phone,
        staff_account.username AS assigned_username,
        staff_account.role AS assigned_role,
        last_message.message_id AS last_message_id,
        last_message.content AS last_content,
        last_message.sender_type AS last_sender_type,
        last_message.image_url AS last_image_url,
        last_message.image_data AS last_image_data,
        COALESCE(admin_unread.total, 0) AS unread_for_admin,
        COALESCE(user_unread.total, 0) AS unread_for_user,
        COALESCE(message_counts.total, 0) AS message_count
    FROM conversation conv
    INNER JOIN customer ON customer.customer_id = conv.customer_id
    INNER JOIN account AS customer_account ON customer_account.id = conv.customer_id
    LEFT JOIN account AS staff_account ON staff_account.id = conv.staff_id
    LEFT JOIN message AS last_message
        ON last_message.message_id = (
            SELECT m2.message_id
            FROM message m2
            WHERE m2.conversation_id = conv.conversation_id
              AND COALESCE(m2.is_deleted, 0) = 0
            ORDER BY m2.created_at DESC, m2.message_id DESC
            LIMIT 1
        )
    LEFT JOIN (
        SELECT conversation_id, COUNT(*) AS total
        FROM message
        WHERE sender_type = 'customer' AND is_read = 0 AND COALESCE(is_deleted, 0) = 0
        GROUP BY conversation_id
    ) AS admin_unread ON admin_unread.conversation_id = conv.conversation_id
    LEFT JOIN (
        SELECT conversation_id, COUNT(*) AS total
        FROM message
        WHERE sender_type IN ('admin', 'staff') AND is_read = 0 AND COALESCE(is_deleted, 0) = 0
        GROUP BY conversation_id
    ) AS user_unread ON user_unread.conversation_id = conv.conversation_id
    LEFT JOIN (
        SELECT conversation_id, COUNT(*) AS total
        FROM message
        WHERE COALESCE(is_deleted, 0) = 0
        GROUP BY conversation_id
    ) AS message_counts ON message_counts.conversation_id = conv.conversation_id
    ${whereClause}
    ORDER BY conv.last_message_at DESC, conv.conversation_id DESC
`;

const mapConversationSummaryRow = (row) => {
    const displayName = [row.first_name, row.last_name]
        .map((value) => String(value || '').trim())
        .filter(Boolean)
        .join(' ')
        .trim();

    return {
        id: String(row.conversation_id),
        participant: {
            accountId: Number(row.customer_id),
            username: row.participant_username || '',
            displayName: displayName || row.participant_username || 'Khách hàng',
            email: row.participant_email || row.participant_username || '',
            phone: row.participant_phone || '',
        },
        assignedAdmin: row.staff_id
            ? {
                  accountId: Number(row.staff_id),
                  username: row.assigned_username || '',
                  role: row.assigned_role || '',
              }
            : null,
        lastMessagePreview: getLastMessagePreview(row),
        lastMessageAt: row.last_message_at,
        lastSenderRole: row.last_sender_type === 'customer' ? 'user' : row.last_sender_type || 'user',
        unreadForAdmin: Number(row.unread_for_admin || 0),
        unreadForUser: Number(row.unread_for_user || 0),
        messageCount: Number(row.message_count || 0),
        status: row.status || 'open',
    };
};

const mapMessageRow = (row) => {
    const displayName = [row.customer_first_name, row.customer_last_name]
        .map((value) => String(value || '').trim())
        .filter(Boolean)
        .join(' ')
        .trim();

    const senderName =
        row.sender_type === 'customer'
            ? displayName || row.customer_username || 'Khách hàng'
            : row.staff_username || 'Hỗ trợ';

    const hasInlineImage = Buffer.isBuffer(row.image_data) && row.image_data.length > 0;
    const imageUrl = hasInlineImage
        ? `data:${row.image_mime_type || 'application/octet-stream'};base64,${row.image_data.toString('base64')}`
        : row.image_url || '';

    return {
        id: String(row.message_id),
        senderRole: row.sender_type === 'customer' ? 'user' : row.sender_type,
        senderId: Number(row.sender_id),
        senderName,
        content: row.content || '',
        imageUrl,
        imageName: row.image_name || '',
        imageMimeType: row.image_mime_type || '',
        isDeleted: false,
        canRecall: true,
        createdAt: row.created_at,
        readByAdminAt: row.sender_type === 'customer' && Number(row.is_read || 0) === 1 ? row.created_at : null,
        readByUserAt: row.sender_type !== 'customer' && Number(row.is_read || 0) === 1 ? row.created_at : null,
    };
};

const resolveMessageType = ({ content, imageUrl }) => {
    if (imageUrl) {
        return 'image';
    }

    return 'text';
};

const SupportModel = {
    ensureTables: async () => {
        if (!ensureSupportTablesPromise) {
            ensureSupportTablesPromise = (async () => {
                await db.query(CONVERSATION_TABLE_SQL);
                await db.query(MESSAGE_TABLE_SQL);
                await ensureColumnExists({
                    tableName: 'message',
                    columnName: 'is_deleted',
                    definition: 'TINYINT(1) NOT NULL DEFAULT 0 AFTER is_read',
                });
                await ensureColumnExists({
                    tableName: 'message',
                    columnName: 'image_url',
                    definition: 'TEXT NULL AFTER message_type',
                });
                await ensureColumnExists({
                    tableName: 'message',
                    columnName: 'image_data',
                    definition: 'MEDIUMBLOB NULL AFTER image_url',
                });
                await ensureColumnExists({
                    tableName: 'message',
                    columnName: 'image_name',
                    definition: 'VARCHAR(255) NULL AFTER image_data',
                });
                await ensureColumnExists({
                    tableName: 'message',
                    columnName: 'image_mime_type',
                    definition: 'VARCHAR(100) NULL AFTER image_name',
                });
            })();
        }

        return ensureSupportTablesPromise;
    },

    getConversationSummaryByCustomerId: async (customerId) => {
        await SupportModel.ensureTables();
        const [rows] = await db.query(
            buildConversationSummaryQuery('WHERE conv.customer_id = ?'),
            [customerId]
        );

        return rows[0] ? mapConversationSummaryRow(rows[0]) : null;
    },

    getConversationSummaryById: async (conversationId) => {
        await SupportModel.ensureTables();
        const [rows] = await db.query(
            buildConversationSummaryQuery('WHERE conv.conversation_id = ?'),
            [conversationId]
        );

        return rows[0] ? mapConversationSummaryRow(rows[0]) : null;
    },

    getConversationAccessById: async (conversationId) => {
        await SupportModel.ensureTables();
        const [rows] = await db.query(
            'SELECT conversation_id, customer_id, staff_id, status, created_at, last_message_at FROM conversation WHERE conversation_id = ? LIMIT 1',
            [conversationId]
        );

        return rows[0] || null;
    },

    getAdminConversationSummaries: async () => {
        await SupportModel.ensureTables();
        const [rows] = await db.query(buildConversationSummaryQuery());
        return rows.map(mapConversationSummaryRow);
    },

    getMessagesByConversationId: async (conversationId) => {
        await SupportModel.ensureTables();
        const [rows] = await db.query(
            `
                SELECT
                    m.*,
                    customer.first_name AS customer_first_name,
                    customer.last_name AS customer_last_name,
                    customer_account.username AS customer_username,
                    staff_account.username AS staff_username
                FROM message m
                INNER JOIN conversation conv ON conv.conversation_id = m.conversation_id
                INNER JOIN customer ON customer.customer_id = conv.customer_id
                INNER JOIN account AS customer_account ON customer_account.id = conv.customer_id
                LEFT JOIN account AS staff_account ON staff_account.id = m.sender_id
                WHERE m.conversation_id = ?
                  AND COALESCE(m.is_deleted, 0) = 0
                ORDER BY m.created_at ASC, m.message_id ASC
            `,
            [conversationId]
        );

        return rows.map(mapMessageRow);
    },

    upsertUserConversationMessage: async ({ customerId, content, image }) => {
        await SupportModel.ensureTables();
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            const sentAt = new Date();
            const [existingConversations] = await connection.query(
                'SELECT conversation_id FROM conversation WHERE customer_id = ? ORDER BY conversation_id ASC LIMIT 1',
                [customerId]
            );

            let conversationId = Number(existingConversations[0]?.conversation_id || 0);

            if (!conversationId) {
                const [insertConversationResult] = await connection.query(
                    `
                        INSERT INTO conversation (customer_id, created_at, last_message_at, status)
                        VALUES (?, ?, ?, 'open')
                    `,
                    [customerId, sentAt, sentAt]
                );
                conversationId = Number(insertConversationResult.insertId);
            }

            const imageData = image?.buffer || null;
            await connection.query(
                `
                    INSERT INTO message (
                        conversation_id,
                        sender_id,
                        sender_type,
                        content,
                        message_type,
                        image_url,
                        image_data,
                        image_name,
                        image_mime_type,
                        is_read,
                        created_at
                    ) VALUES (?, ?, 'customer', ?, ?, ?, ?, ?, ?, 0, ?)
                `,
                [
                    conversationId,
                    customerId,
                    content || '',
                    resolveMessageType({ content, imageUrl: imageData ? 'inline-image' : '' }),
                    null,
                    imageData,
                    image?.originalname || null,
                    image?.mimetype || null,
                    sentAt,
                ]
            );

            await connection.query(
                'UPDATE conversation SET last_message_at = ?, status = ? WHERE conversation_id = ?',
                [sentAt, 'open', conversationId]
            );

            await connection.commit();
            return conversationId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    createAdminConversationMessage: async ({ conversationId, senderId, senderType, content, image }) => {
        await SupportModel.ensureTables();
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            const sentAt = new Date();
            const imageData = image?.buffer || null;

            await connection.query(
                `
                    INSERT INTO message (
                        conversation_id,
                        sender_id,
                        sender_type,
                        content,
                        message_type,
                        image_url,
                        image_data,
                        image_name,
                        image_mime_type,
                        is_read,
                        created_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
                `,
                [
                    conversationId,
                    senderId,
                    senderType,
                    content || '',
                    resolveMessageType({ content, imageUrl: imageData ? 'inline-image' : '' }),
                    null,
                    imageData,
                    image?.originalname || null,
                    image?.mimetype || null,
                    sentAt,
                ]
            );

            await connection.query(
                'UPDATE conversation SET staff_id = ?, last_message_at = ?, status = ? WHERE conversation_id = ?',
                [senderId, sentAt, 'open', conversationId]
            );

            await connection.commit();
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    markConversationReadForAdmin: async (conversationId) => {
        await SupportModel.ensureTables();
        await db.query(
            `UPDATE message
             SET is_read = 1
             WHERE conversation_id = ? AND sender_type = 'customer' AND is_read = 0 AND COALESCE(is_deleted, 0) = 0`,
            [conversationId]
        );
    },

    markConversationReadForUser: async (conversationId) => {
        await SupportModel.ensureTables();
        await db.query(
            `UPDATE message
             SET is_read = 1
             WHERE conversation_id = ? AND sender_type IN ('admin', 'staff') AND is_read = 0 AND COALESCE(is_deleted, 0) = 0`,
            [conversationId]
        );
    },

    getMessageAccessById: async ({ conversationId, messageId }) => {
        await SupportModel.ensureTables();
        const [rows] = await db.query(
            `
                SELECT
                    message_id,
                    conversation_id,
                    sender_id,
                    sender_type,
                    created_at
                FROM message
                WHERE conversation_id = ?
                  AND message_id = ?
                  AND COALESCE(is_deleted, 0) = 0
                LIMIT 1
            `,
            [conversationId, messageId]
        );

        return rows[0] || null;
    },

    refreshConversationState: async (connection, conversationId) => {
        const [[conversationRow]] = await connection.query(
            'SELECT created_at FROM conversation WHERE conversation_id = ? LIMIT 1',
            [conversationId]
        );

        if (!conversationRow) {
            return;
        }

        const [[lastMessageRow]] = await connection.query(
            `
                SELECT sender_id, sender_type, created_at
                FROM message
                WHERE conversation_id = ?
                  AND COALESCE(is_deleted, 0) = 0
                ORDER BY created_at DESC, message_id DESC
                LIMIT 1
            `,
            [conversationId]
        );

        const nextLastMessageAt = lastMessageRow?.created_at || conversationRow.created_at;
        const nextStaffId =
            lastMessageRow && ['admin', 'staff'].includes(lastMessageRow.sender_type)
                ? Number(lastMessageRow.sender_id)
                : null;

        await connection.query(
            `
                UPDATE conversation
                SET last_message_at = ?, staff_id = ?, status = ?
                WHERE conversation_id = ?
            `,
            [nextLastMessageAt, nextStaffId, 'open', conversationId]
        );
    },

    deleteMessageById: async ({ conversationId, messageId }) => {
        await SupportModel.ensureTables();
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            const [result] = await connection.query(
                `
                    DELETE FROM message
                    WHERE conversation_id = ?
                      AND message_id = ?
                      AND COALESCE(is_deleted, 0) = 0
                    LIMIT 1
                `,
                [conversationId, messageId]
            );

            if (Number(result.affectedRows || 0) > 0) {
                await SupportModel.refreshConversationState(connection, conversationId);
            }

            await connection.commit();
            return Number(result.affectedRows || 0);
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },
};

export default SupportModel;
