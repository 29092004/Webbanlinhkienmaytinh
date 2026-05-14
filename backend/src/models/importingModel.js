import db from '../config/mysql.js';

const table_name = 'importing';

const ImportingModel = {
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

    create: async (date, totalPrice, supplierId) => {
        const [result] = await db.query(
            `INSERT INTO ${table_name} (date, total_price, id_supplier) VALUES (?, ?, ?)`,
            [date, totalPrice, supplierId]
        );
        return result.insertId;
    },

    update: async (id, date, totalPrice, supplierId) => {
        const [result] = await db.query(
            `UPDATE ${table_name} SET date = ?, total_price = ?, id_supplier = ? WHERE id = ?`,
            [date, totalPrice, supplierId, id]
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

export default ImportingModel;
