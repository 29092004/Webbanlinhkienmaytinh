import db from '../config/mysql.js';

const table_name = 'customer';

const normalizeCustomerRow = (row) => {
    if (!row) {
        return null;
    }

    return {
        ...row,
        account_id: row.customer_id ?? null,
        firstName: row.first_name ?? '',
        lastName: row.last_name ?? '',
    };
};

const CustomerModel = {
    getAll: async () => {
        const [rows] = await db.query(`
            SELECT
                c.*,
                a.username AS account_username,
                a.role AS account_role
            FROM ${table_name} c
            LEFT JOIN account a ON a.id = c.customer_id
        `);
        return rows.map(normalizeCustomerRow);
    },

    getById: async (customerId) => {
        const [rows] = await db.query(
            `SELECT
                c.*,
                a.username AS account_username,
                a.role AS account_role
            FROM ${table_name} c
            LEFT JOIN account a ON a.id = c.customer_id
            WHERE c.customer_id = ?`,
            [customerId]
        );
        return normalizeCustomerRow(rows[0] || null);
    },

    create: async (customerId, firstName, lastName, email, phone, address, executor = db) => {
        const [result] = await executor.query(
            `INSERT INTO ${table_name} (customer_id, first_name, last_name, email, phone, address) VALUES (?, ?, ?, ?, ?, ?)`,
            [customerId, firstName, lastName, email, phone, address]
        );
        return result.insertId;
    },

    update: async (customerId, firstName, lastName, email, phone, address, executor = db) => {
        const [result] = await executor.query(
            `UPDATE ${table_name} SET first_name = ?, last_name = ?, email = ?, phone = ?, address = ? WHERE customer_id = ?`,
            [firstName, lastName, email, phone, address, customerId]
        );
        return result.affectedRows;
    },

    delete: async (customerId, executor = db) => {
        const [result] = await executor.query(
            `DELETE FROM ${table_name} WHERE customer_id = ?`,
            [customerId]
        );
        return result.affectedRows;
    },
};

export default CustomerModel;
