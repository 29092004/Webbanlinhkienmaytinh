import db from '../config/mysql.js';

const table_name = 'brand';

const BrandModel = {
    getAll: async () => {
        const [rows] = await db.query(`
            SELECT *
            FROM ${table_name}
        `);
        return rows;
    },

    getById: async (brandId) => {
        const [rows] = await db.query(
            `SELECT * FROM ${table_name} WHERE brand_id = ?`,
            [brandId]
        );
        return rows[0] || null;
    },

    create: async (brandName) => {
        const [result] = await db.query(
            `INSERT INTO ${table_name} (brand_name) VALUES (?)`,
            [brandName]
        );
        return result.insertId;
    },

    update: async (brandId, brandName) => {
        const [result] = await db.query(
            `UPDATE ${table_name} SET brand_name = ? WHERE brand_id = ?`,
            [brandName, brandId]
        );
        return result.affectedRows;
    },

    delete: async (brandId) => {
        const [result] = await db.query(
            `DELETE FROM ${table_name} WHERE brand_id = ?`,
            [brandId]
        );
        return result.affectedRows;
    },
};

export default BrandModel;
