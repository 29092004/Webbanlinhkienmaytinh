import db from '../config/mysql.js';

const table_name = 'shipping';

const ShippingModel = {
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

    create: async (date, deliveryMethod, status, customerId, orderId, shippingAddress) => {
        const [result] = await db.query(
            `INSERT INTO ${table_name} (date, delivery_method, status, id_customer, id_order, shipping_address) VALUES (?, ?, ?, ?, ?, ?)`,
            [date, deliveryMethod, status, customerId, orderId, shippingAddress]
        );
        return result.insertId;
    },

    update: async (id, date, deliveryMethod, status, customerId, orderId, shippingAddress) => {
        const [result] = await db.query(
            `UPDATE ${table_name} SET date = ?, delivery_method = ?, status = ?, id_customer = ?, id_order = ?, shipping_address = ? WHERE id = ?`,
            [date, deliveryMethod, status, customerId, orderId, shippingAddress, id]
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

export default ShippingModel;
