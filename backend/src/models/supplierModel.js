import db from '../config/mysql.js';

const table_name = 'supplier';

const SupplierModel = {
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

    create: async (name, phonenumber, email, address) => {
        const [result] = await db.query(
            `INSERT INTO ${table_name} (name, phonenumber, email, address) VALUES (?, ?, ?, ?)`,
            [name, phonenumber, email, address]
        );
        return result.insertId;
    },

    update: async (id, name, phonenumber, email, address) => {
        const [result] = await db.query(
            `UPDATE ${table_name} SET name = ?, phonenumber = ?, email = ?, address = ? WHERE id = ?`,
            [name, phonenumber, email, address, id]
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

export default SupplierModel;
