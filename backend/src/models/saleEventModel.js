import db from '../config/mysql.js';

const table_name = 'sale_event';

const SaleEventModel = {
    getAll: async () => {
        const [rows] = await db.query(`
            SELECT *
            FROM ${table_name}
        `);
        return rows;
    },

    getById: async (saleId) => {
        const [rows] = await db.query(
            `SELECT * FROM ${table_name} WHERE sale_id = ?`,
            [saleId]
        );
        return rows[0] || null;
    },

    create: async (saleType, saleValue, saleDuration) => {
        const [result] = await db.query(
            `INSERT INTO ${table_name} (sale_type, sale_value, sale_duration) VALUES (?, ?, ?)`,
            [saleType, saleValue, saleDuration]
        );
        return result.insertId;
    },

    update: async (saleId, saleType, saleValue, saleDuration) => {
        const [result] = await db.query(
            `UPDATE ${table_name} SET sale_type = ?, sale_value = ?, sale_duration = ? WHERE sale_id = ?`,
            [saleType, saleValue, saleDuration, saleId]
        );
        return result.affectedRows;
    },

    delete: async (saleId) => {
        const [result] = await db.query(
            `DELETE FROM ${table_name} WHERE sale_id = ?`,
            [saleId]
        );
        return result.affectedRows;
    },
};

export default SaleEventModel;
