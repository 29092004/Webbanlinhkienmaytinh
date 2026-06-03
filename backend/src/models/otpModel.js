import db from '../config/mysql.js';

const OTP_TABLE_SQL = `
    CREATE TABLE IF NOT EXISTS register_otp (
        email VARCHAR(255) PRIMARY KEY,
        otp_hash VARCHAR(255) NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
`;

let ensureOtpTablePromise = null;

const toMysqlDateTime = (value) => {
    const date = value instanceof Date ? value : new Date(value);

    return date.toISOString().slice(0, 19).replace('T', ' ');
};

const otpModel = {
    ensureTable: async () => {
        if (!ensureOtpTablePromise) {
            ensureOtpTablePromise = db.query(OTP_TABLE_SQL);
        }

        await ensureOtpTablePromise;
    },

    saveOtp: async ({ email, otpHash, expiresAt }) => {
        await otpModel.ensureTable();

        await db.query(
            `
                INSERT INTO register_otp (email, otp_hash, expires_at)
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    otp_hash = VALUES(otp_hash),
                    expires_at = VALUES(expires_at)
            `,
            [email, otpHash, toMysqlDateTime(expiresAt)]
        );
    },

    getOtpByEmail: async (email) => {
        await otpModel.ensureTable();

        const [rows] = await db.query(
            `
                SELECT email, otp_hash, expires_at
                FROM register_otp
                WHERE email = ?
                LIMIT 1
            `,
            [email]
        );

        return rows[0] || null;
    },

    deleteOtpByEmail: async (email) => {
        await otpModel.ensureTable();
        await db.query('DELETE FROM register_otp WHERE email = ?', [email]);
    },

    deleteExpiredOtps: async () => {
        await otpModel.ensureTable();
        await db.query('DELETE FROM register_otp WHERE expires_at <= NOW()');
    },
};

export default otpModel;
