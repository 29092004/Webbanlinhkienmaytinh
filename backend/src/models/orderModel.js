import db from '../config/mysql.js';

const table_name = '`order`';

const OrderModel = {
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

    create: async (createdAt, paymentMethod, status, productId, accountId) => {
        const [result] = await db.query(
            `INSERT INTO ${table_name} (created_at, payment_method, status, product_id, account_id) VALUES (?, ?, ?, ?, ?)`,
            [createdAt, paymentMethod, status, productId, accountId]
        );
        return result.insertId;
    },

    update: async (id, createdAt, paymentMethod, status, productId, accountId) => {
        const [result] = await db.query(
            `UPDATE ${table_name} SET created_at = ?, payment_method = ?, status = ?, product_id = ?, account_id = ? WHERE id = ?`,
            [createdAt, paymentMethod, status, productId, accountId, id]
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

export default OrderModel;
