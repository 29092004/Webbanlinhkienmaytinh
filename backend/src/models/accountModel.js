import db from '../config/mysql.js';

const table_name = 'account';
let hasRefreshTokenColumnCache = null;

const supportsRefreshToken = async (executor = db) => {
    if (hasRefreshTokenColumnCache !== null) {
        return hasRefreshTokenColumnCache;
    }

    const [rows] = await executor.query(
        `
            SELECT COUNT(*) AS total
            FROM information_schema.COLUMNS
            WHERE TABLE_SCHEMA = DATABASE()
                AND TABLE_NAME = ?
                AND COLUMN_NAME = 'refresh_token'
        `,
        [table_name]
    );

    hasRefreshTokenColumnCache = Number(rows[0]?.total ?? 0) > 0;
    return hasRefreshTokenColumnCache;
};

const AccountModel = {
    supportsRefreshToken,

    getAll: async () => {
        const [rows] = await db.query(`
            SELECT *
            FROM ${table_name}
        `);
        return rows;
    },

    getById: async (id) => {
        const [rows] = await db.query(
            `SELECT * FROM ${table_name} WHERE id = ?`,
            [id]
        );
        return rows[0] || null;
    },

    findByUsername: async (username) => {
        const [rows] = await db.query(
            `SELECT * FROM ${table_name} WHERE username = ? LIMIT 1`,
            [username]
        );
        return rows[0] || null;
    },

    create: async (username, password, role, refreshToken = null, executor = db) => {
        if (await supportsRefreshToken(executor)) {
            const [result] = await executor.query(
                `INSERT INTO ${table_name} (username, password, role, refresh_token) VALUES (?, ?, ?, ?)`,
                [username, password, role, refreshToken]
            );
            return result.insertId;
        }

        const [result] = await executor.query(
            `INSERT INTO ${table_name} (username, password, role) VALUES (?, ?, ?)`,
            [username, password, role]
        );
        return result.insertId;
    },

    update: async (id, username, password, role, refreshToken = null) => {
        if (await supportsRefreshToken()) {
            const [result] = await db.query(
                `UPDATE ${table_name} SET username = ?, password = ?, role = ?, refresh_token = COALESCE(?, refresh_token) WHERE id = ?`,
                [username, password, role, refreshToken, id]
            );
            return result.affectedRows;
        }

        const [result] = await db.query(
            `UPDATE ${table_name} SET username = ?, password = ?, role = ? WHERE id = ?`,
            [username, password, role, id]
        );
        return result.affectedRows;
    },

    updateRefreshToken: async (id, refreshToken, executor = db) => {
        if (!(await supportsRefreshToken(executor))) {
            return 0;
        }

        const [result] = await executor.query(
            `UPDATE ${table_name} SET refresh_token = ? WHERE id = ?`,
            [refreshToken, id]
        );
        return result.affectedRows;
    },

    clearRefreshToken: async (id) => {
        if (!(await supportsRefreshToken())) {
            return 0;
        }

        const [result] = await db.query(
            `UPDATE ${table_name} SET refresh_token = NULL WHERE id = ?`,
            [id]
        );
        return result.affectedRows;
    },

    delete: async (id) => {
        const [result] = await db.query(
            `DELETE FROM ${table_name} WHERE id = ?`,
            [id]
        );
        return result.affectedRows;
    },
};

export default AccountModel;
