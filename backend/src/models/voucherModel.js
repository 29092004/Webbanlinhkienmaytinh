import db from '../config/mysql.js';

const table_name = 'voucher';

const VoucherModel = {
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

    create: async (voucherCode, voucherValue, expiredDate, isActive, usageLimit, useCount, forSingleUse) => {
        const [result] = await db.query(
            `INSERT INTO ${table_name} (voucher_code, voucher_value, expired_date, isActive, usageLimit, useCount, ForSingleUse) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [voucherCode, voucherValue, expiredDate, isActive, usageLimit, useCount, forSingleUse]
        );
        return result.insertId;
    },

    update: async (id, voucherCode, voucherValue, expiredDate, isActive, usageLimit, useCount, forSingleUse) => {
        const [result] = await db.query(
            `UPDATE ${table_name} SET voucher_code = ?, voucher_value = ?, expired_date = ?, isActive = ?, usageLimit = ?, useCount = ?, ForSingleUse = ? WHERE id = ?`,
            [voucherCode, voucherValue, expiredDate, isActive, usageLimit, useCount, forSingleUse, id]
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

export default VoucherModel;
