import db from '../config/mysql.js';

const table_name = 'customer';

const CustomerModel = {
    getAll: async () => {
        const [rows] = await db.query(`
            SELECT *
            FROM ${table_name}
        `);
        return rows;
    },

    getById: async (customerId) => {
        const [rows] = await db.query(
            `SELECT * FROM ${table_name} WHERE customer_id = ?`,
            [customerId]
        );
        return rows[0] || null;
    },

    create: async (firstName, lastName, gender, email, phone, address, accountId = null, executor = db) => {
        const [result] = await executor.query(
            `INSERT INTO ${table_name} (first_name, last_name, gender, email, phone, address, account_id) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [firstName, lastName, gender, email, phone, address, accountId]
        );
        return result.insertId;
    },

    update: async (customerId, firstName, lastName, gender, email, phone, address, accountId = null) => {
        const [result] = await db.query(
            `UPDATE ${table_name} SET first_name = ?, last_name = ?, gender = ?, email = ?, phone = ?, address = ?, account_id = COALESCE(?, account_id) WHERE customer_id = ?`,
            [firstName, lastName, gender, email, phone, address, accountId, customerId]
        );
        return result.affectedRows;
    },

    delete: async (customerId) => {
        const [result] = await db.query(
            `DELETE FROM ${table_name} WHERE customer_id = ?`,
            [customerId]
        );
        return result.affectedRows;
    },
};

export default CustomerModel;
