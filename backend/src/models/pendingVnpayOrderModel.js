import db from '../config/mysql.js';

const TABLE_NAME = 'pending_vnpay_order';

const CREATE_TABLE_SQL = `
    CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
        id INT PRIMARY KEY AUTO_INCREMENT,
        txn_ref VARCHAR(100) NOT NULL UNIQUE,
        account_id INT NOT NULL,
        amount BIGINT NOT NULL,
        status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
        order_payload LONGTEXT NOT NULL,
        order_id INT NULL,
        response_code VARCHAR(20) NULL,
        expires_at DATETIME NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        KEY idx_pending_vnpay_account (account_id),
        KEY idx_pending_vnpay_status (status),
        CONSTRAINT fk_pending_vnpay_account FOREIGN KEY (account_id) REFERENCES account(id) ON DELETE CASCADE,
        CONSTRAINT fk_pending_vnpay_order FOREIGN KEY (order_id) REFERENCES \`order\`(id) ON DELETE SET NULL
    )
`;

let ensureTablePromise = null;

const parseRow = (row) => {
    if (!row) {
        return null;
    }

    let orderPayload = null;
    try {
        orderPayload = JSON.parse(row.order_payload);
    } catch {
        orderPayload = null;
    }

    return {
        ...row,
        orderPayload,
    };
};

const pendingVnpayOrderModel = {
    ensureTable: async () => {
        if (!ensureTablePromise) {
            ensureTablePromise = db.query(CREATE_TABLE_SQL);
        }

        await ensureTablePromise;
    },

    create: async ({
        txnRef,
        accountId,
        amount,
        orderPayload,
        expiresAt,
    }) => {
        await pendingVnpayOrderModel.ensureTable();

        await db.query(
            `
                INSERT INTO ${TABLE_NAME} (txn_ref, account_id, amount, status, order_payload, expires_at)
                VALUES (?, ?, ?, 'PENDING', ?, ?)
            `,
            [
                txnRef,
                accountId,
                amount,
                JSON.stringify(orderPayload),
                expiresAt,
            ]
        );

        return pendingVnpayOrderModel.getByTxnRef(txnRef);
    },

    getByTxnRef: async (txnRef) => {
        await pendingVnpayOrderModel.ensureTable();

        const [rows] = await db.query(
            `SELECT * FROM ${TABLE_NAME} WHERE txn_ref = ? LIMIT 1`,
            [txnRef]
        );

        return parseRow(rows[0] || null);
    },

    markCompleted: async ({ txnRef, orderId, responseCode }) => {
        await pendingVnpayOrderModel.ensureTable();

        await db.query(
            `
                UPDATE ${TABLE_NAME}
                SET status = 'COMPLETED', order_id = ?, response_code = ?
                WHERE txn_ref = ?
            `,
            [orderId, responseCode || null, txnRef]
        );
    },

    markStatus: async ({ txnRef, status, responseCode = null }) => {
        await pendingVnpayOrderModel.ensureTable();

        await db.query(
            `
                UPDATE ${TABLE_NAME}
                SET status = ?, response_code = ?
                WHERE txn_ref = ?
            `,
            [status, responseCode, txnRef]
        );
    },
};

export default pendingVnpayOrderModel;
