import db from '../config/mysql.js';

const table_name = 'cart';

const CartModel = {
    getAll: async () => {
        const [rows] = await db.query(`
            SELECT *
            FROM ${table_name}
        `);
        return rows;
    },

    getById: async (customerId, productId) => {
        const [rows] = await db.query(
            `SELECT * FROM ${table_name} WHERE customer_id = ? AND product_id = ?`,
            [customerId, productId]
        );
        return rows[0] || null;
    },

    create: async (quantity, productId, customerId) => {
        const [result] = await db.query(
            `INSERT INTO ${table_name} (quantity, product_id, customer_id) VALUES (?, ?, ?)`,
            [quantity, productId, customerId]
        );
        return result.affectedRows;
    },

    update: async (customerId, productId, quantity) => {
        const [result] = await db.query(
            `UPDATE ${table_name} SET quantity = ? WHERE customer_id = ? AND product_id = ?`,
            [quantity, customerId, productId]
        );
        return result.affectedRows;
    },

    delete: async (customerId, productId) => {
        const [result] = await db.query(
            `DELETE FROM ${table_name} WHERE customer_id = ? AND product_id = ?`,
            [customerId, productId]
        );
        return result.affectedRows;
    },
};

export default CartModel;
