import db from '../config/mysql.js';

const table_name = 'category';

const CategoryModel = {
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

    create: async (name) => {
        const [result] = await db.query(
            `INSERT INTO ${table_name} (name) VALUES (?)`,
            [name]
        );
        return result.insertId;
    },

    update: async (id, name) => {
        const [result] = await db.query(
            `UPDATE ${table_name} SET name = ? WHERE id = ?`,
            [name, id]
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

export default CategoryModel;
