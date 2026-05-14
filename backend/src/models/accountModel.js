import db from '../config/mysql.js';

const table_name = 'account';

const AccountModel = {
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
        const [result] = await executor.query(
            `INSERT INTO ${table_name} (username, password, role, refresh_token) VALUES (?, ?, ?, ?)`,
            [username, password, role, refreshToken]
        );
        return result.insertId;
    },

    update: async (id, username, password, role, refreshToken = null) => {
        const [result] = await db.query(
            `UPDATE ${table_name} SET username = ?, password = ?, role = ?, refresh_token = COALESCE(?, refresh_token) WHERE id = ?`,
            [username, password, role, refreshToken, id]
        );
        return result.affectedRows;
    },

    updateRefreshToken: async (id, refreshToken, executor = db) => {
        const [result] = await executor.query(
            `UPDATE ${table_name} SET refresh_token = ? WHERE id = ?`,
            [refreshToken, id]
        );
        return result.affectedRows;
    },

    clearRefreshToken: async (id) => {
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
