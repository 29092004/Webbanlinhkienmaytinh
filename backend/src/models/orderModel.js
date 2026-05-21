import db from '../config/mysql.js';

const table_name = '`order`';

const attachOrderDetails = async (orders) => {
    if (orders.length === 0) {
        return orders;
    }

    const orderIds = orders.map((order) => order.id);
    const [detailRows] = await db.query(`
        SELECT
            od.*,
            p.name AS product_name
        FROM order_detail od
        LEFT JOIN product p ON p.id = od.product_id
        WHERE od.order_id IN (?)
        ORDER BY od.order_id ASC, od.product_id ASC
    `, [orderIds]);

    const detailsByOrderId = new Map();
    for (const detail of detailRows) {
        if (!detailsByOrderId.has(detail.order_id)) {
            detailsByOrderId.set(detail.order_id, []);
        }
        detailsByOrderId.get(detail.order_id).push(detail);
    }

    return orders.map((order) => ({
        ...order,
        voucherId: order.voucher_id ?? null,
        totalPrice: order.total_price ?? null,
        details: detailsByOrderId.get(order.id) ?? [],
        product_id: detailsByOrderId.get(order.id)?.[0]?.product_id ?? null,
        product_name: detailsByOrderId.get(order.id)?.[0]?.product_name ?? null,
        quantity: detailsByOrderId.get(order.id)?.[0]?.quantity ?? null,
        subtotal_price: detailsByOrderId.get(order.id)?.[0]?.subtotal_price ?? null,
        note: detailsByOrderId.get(order.id)?.[0]?.note ?? null,
    }));
};

const replaceOrderDetails = async (connection, orderId, details = []) => {
    await connection.query('DELETE FROM order_detail WHERE order_id = ?', [orderId]);

    for (const detail of details) {
        await connection.query(
            'INSERT INTO order_detail (order_id, product_id, quantity, subtotal_price, note) VALUES (?, ?, ?, ?, ?)',
            [
                orderId,
                detail.productId ?? detail.product_id,
                detail.quantity,
                detail.subtotalPrice ?? detail.subtotal_price,
                detail.note ?? null,
            ]
        );
    }
};

const OrderModel = {
    getAll: async () => {
        const [rows] = await db.query(`
            SELECT
                o.*,
                a.username AS account_username,
                a.role AS account_role,
                v.voucher_code,
                v.voucher_value,
                c.customer_id,
                c.first_name AS customer_first_name,
                c.last_name AS customer_last_name,
                c.email AS customer_email,
                c.phone AS customer_phone,
                c.address AS customer_address
            FROM ${table_name} o
            LEFT JOIN account a ON a.id = o.account_id
            LEFT JOIN voucher v ON v.id = o.voucher_id
            LEFT JOIN customer c ON c.customer_id = o.account_id
        `);

        return attachOrderDetails(rows);
    },

    getById: async (id) => {
        const [rows] = await db.query(
            `SELECT
                o.*,
                a.username AS account_username,
                a.role AS account_role,
                v.voucher_code,
                v.voucher_value,
                c.customer_id,
                c.first_name AS customer_first_name,
                c.last_name AS customer_last_name,
                c.email AS customer_email,
                c.phone AS customer_phone,
                c.address AS customer_address
            FROM ${table_name} o
            LEFT JOIN account a ON a.id = o.account_id
            LEFT JOIN voucher v ON v.id = o.voucher_id
            LEFT JOIN customer c ON c.customer_id = o.account_id
            WHERE o.id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return null;
        }

        const [order] = await attachOrderDetails(rows);
        return order;
    },

    create: async (createdAt, paymentMethod, status, accountId, voucherId, totalPrice, details = []) => {
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            const [result] = await connection.query(
                `INSERT INTO ${table_name} (created_at, payment_method, status, account_id, voucher_id, total_price) VALUES (?, ?, ?, ?, ?, ?)`,
                [createdAt, paymentMethod, status, accountId, voucherId ?? null, totalPrice]
            );

            await replaceOrderDetails(connection, result.insertId, details);
            await connection.commit();

            return result.insertId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    update: async (id, createdAt, paymentMethod, status, accountId, voucherId, totalPrice, details = []) => {
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            const [result] = await connection.query(
                `UPDATE ${table_name} SET created_at = ?, payment_method = ?, status = ?, account_id = ?, voucher_id = ?, total_price = ? WHERE id = ?`,
                [createdAt, paymentMethod, status, accountId, voucherId ?? null, totalPrice, id]
            );

            if (result.affectedRows === 0) {
                await connection.rollback();
                return 0;
            }

            await replaceOrderDetails(connection, id, details);
            await connection.commit();

            return result.affectedRows;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    delete: async (id) => {
        const [result] = await db.query(
            `DELETE FROM ${table_name} WHERE id = ?`,
            [id]
        );
        return result.affectedRows;
    },
};

export default OrderModel;
