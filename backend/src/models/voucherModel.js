import db from '../config/mysql.js';

const tableName = 'voucher';

const baseSelect = `
    SELECT
        id,
        voucher_code AS voucherCode,
        voucher_code,
        discount_type AS discountType,
        discount_type,
        discount_value AS discountValue,
        discount_value,
        min_order_value AS minOrderValue,
        min_order_value,
        max_discount_value AS maxDiscountValue,
        max_discount_value,
        start_date AS startDate,
        start_date,
        expired_date AS expiredDate,
        expired_date,
        usage_limit AS usageLimit,
        usage_limit,
        used_count AS usedCount,
        used_count,
        is_active AS isActive,
        is_active,
        usage_per_customer AS usagePerCustomer,
        usage_per_customer
    FROM ${tableName}
`;

const VoucherModel = {
    getAll: async () => {
        const [rows] = await db.query(`${baseSelect} ORDER BY id DESC`);
        return rows;
    },

    getById: async (id) => {
        const [rows] = await db.query(`${baseSelect} WHERE id = ?`, [id]);
        return rows[0] || null;
    },

    getByCode: async (voucherCode) => {
        const [rows] = await db.query(`${baseSelect} WHERE voucher_code = ? LIMIT 1`, [voucherCode]);
        return rows[0] || null;
    },

    create: async ({
        voucherCode,
        discountType,
        discountValue,
        minOrderValue,
        maxDiscountValue,
        startDate,
        expiredDate,
        usageLimit,
        usedCount,
        isActive,
        usagePerCustomer,
    }) => {
        const [result] = await db.query(
            `INSERT INTO ${tableName}
            (
                voucher_code,
                discount_type,
                discount_value,
                min_order_value,
                max_discount_value,
                start_date,
                expired_date,
                usage_limit,
                used_count,
                is_active,
                usage_per_customer
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                voucherCode,
                discountType,
                discountValue,
                minOrderValue,
                maxDiscountValue,
                startDate,
                expiredDate,
                usageLimit,
                usedCount,
                isActive,
                usagePerCustomer,
            ]
        );

        return result.insertId;
    },

    update: async (id, {
        voucherCode,
        discountType,
        discountValue,
        minOrderValue,
        maxDiscountValue,
        startDate,
        expiredDate,
        usageLimit,
        usedCount,
        isActive,
        usagePerCustomer,
    }) => {
        const [result] = await db.query(
            `UPDATE ${tableName}
            SET
                voucher_code = ?,
                discount_type = ?,
                discount_value = ?,
                min_order_value = ?,
                max_discount_value = ?,
                start_date = ?,
                expired_date = ?,
                usage_limit = ?,
                used_count = ?,
                is_active = ?,
                usage_per_customer = ?
            WHERE id = ?`,
            [
                voucherCode,
                discountType,
                discountValue,
                minOrderValue,
                maxDiscountValue,
                startDate,
                expiredDate,
                usageLimit,
                usedCount,
                isActive,
                usagePerCustomer,
                id,
            ]
        );

        return result.affectedRows;
    },

    delete: async (id) => {
        const [result] = await db.query(`DELETE FROM ${tableName} WHERE id = ?`, [id]);
        return result.affectedRows;
    },
};

export default VoucherModel;
