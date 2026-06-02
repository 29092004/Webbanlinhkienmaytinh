import db from '../config/mysql.js';

const table_name = 'shipping';

const ShippingModel = {
    getAll: async () => {
        const [rows] = await db.query(`
            SELECT
                s.*,
                s.order_id AS id_order,
                c.customer_id,
                c.first_name AS customer_first_name,
                c.last_name AS customer_last_name,
                c.email AS customer_email,
                c.phone AS customer_phone,
                a.username AS account_username,
                o.account_id AS order_account_id,
                o.payment_method,
                o.status AS order_status,
                o.total_price
            FROM ${table_name} s
            INNER JOIN (
                SELECT order_id, MAX(id) AS latest_shipping_id
                FROM ${table_name}
                GROUP BY order_id
            ) latest_shipping ON latest_shipping.latest_shipping_id = s.id
            LEFT JOIN \`order\` o ON o.id = s.order_id
            LEFT JOIN customer c ON c.customer_id = o.account_id
            LEFT JOIN account a ON a.id = o.account_id
        `);
        return rows;
    },

    getById: async (id) => {
        const [rows] = await db.query(
            `SELECT
                s.*,
                s.order_id AS id_order,
                c.customer_id,
                c.first_name AS customer_first_name,
                c.last_name AS customer_last_name,
                c.email AS customer_email,
                c.phone AS customer_phone,
                a.username AS account_username,
                o.account_id AS order_account_id,
                o.payment_method,
                o.status AS order_status,
                o.total_price
            FROM ${table_name} s
            LEFT JOIN \`order\` o ON o.id = s.order_id
            LEFT JOIN customer c ON c.customer_id = o.account_id
            LEFT JOIN account a ON a.id = o.account_id
            WHERE s.id = ?`,
            [id]
        );
        return rows[0] || null;
    },

    getByOrderId: async (orderId) => {
        const [rows] = await db.query(
            `SELECT *
            FROM ${table_name}
            WHERE order_id = ?
            ORDER BY id DESC
            LIMIT 1`,
            [orderId]
        );
        return rows[0] || null;
    },

    updateLatestStatusByOrderId: async (orderId, status) => {
        const [result] = await db.query(
            `UPDATE ${table_name}
            SET status = ?
            WHERE id = (
                SELECT latest_shipping_id
                FROM (
                    SELECT MAX(id) AS latest_shipping_id
                    FROM ${table_name}
                    WHERE order_id = ?
                ) latest_shipping
            )`,
            [status, orderId]
        );

        return result.affectedRows;
    },

    create: async (date, deliveryMethod, status, orderId, shippingAddress) => {
        const [result] = await db.query(
            `INSERT INTO ${table_name} (date, delivery_method, status, order_id, shipping_address) VALUES (?, ?, ?, ?, ?)`,
            [date, deliveryMethod, status, orderId, shippingAddress]
        );
        return result.insertId;
    },

    update: async (id, date, deliveryMethod, status, orderId, shippingAddress) => {
        const [result] = await db.query(
            `UPDATE ${table_name} SET date = ?, delivery_method = ?, status = ?, order_id = ?, shipping_address = ? WHERE id = ?`,
            [date, deliveryMethod, status, orderId, shippingAddress, id]
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

export default ShippingModel;
