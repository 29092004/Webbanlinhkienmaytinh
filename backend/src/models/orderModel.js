import db from '../config/mysql.js';

const tableName = '`order`';

const orderSelect = `
    SELECT
        o.*,
        o.created_at AS createdAt,
        o.payment_method AS paymentMethod,
        o.account_id AS accountId,
        o.voucher_id AS voucherId,
        o.total_price AS totalPrice,
        o.discount_amount AS discountAmount,
        o.final_price AS finalPrice,
        a.username AS account_username,
        a.role AS account_role,
        v.voucher_code,
        v.voucher_code AS voucherCode,
        v.discount_type AS voucherDiscountType,
        v.discount_value AS voucherDiscountValue,
        c.customer_id,
        c.first_name AS customer_first_name,
        c.last_name AS customer_last_name,
        c.email AS customer_email,
        c.phone AS customer_phone,
        c.address AS profile_customer_address,
        ls.shipping_address,
        ls.shipping_address AS shippingAddress,
        ls.status AS shipping_status,
        ls.status AS shippingStatus,
        ls.delivery_method AS shipping_delivery_method,
        ls.delivery_method AS shippingDeliveryMethod,
        COALESCE(ls.shipping_address, c.address) AS customer_address
    FROM ${tableName} o
    LEFT JOIN account a ON a.id = o.account_id
    LEFT JOIN voucher v ON v.id = o.voucher_id
    LEFT JOIN customer c ON c.customer_id = o.account_id
    LEFT JOIN (
        SELECT s1.order_id, s1.shipping_address, s1.delivery_method, s1.status
        FROM shipping s1
        INNER JOIN (
            SELECT order_id, MAX(id) AS latest_shipping_id
            FROM shipping
            GROUP BY order_id
        ) latest_shipping ON latest_shipping.latest_shipping_id = s1.id
    ) ls ON ls.order_id = o.id
`;

const attachOrderDetails = async (orders) => {
    if (orders.length === 0) {
        return orders;
    }

    const orderIds = orders.map((order) => order.id);
    const [detailRows] = await db.query(`
        SELECT
            od.*,
            od.product_id AS productId,
            od.order_id AS orderId,
            od.subtotal_price AS subtotalPrice,
            p.name AS product_name,
            p.name AS productName,
            pi.url AS product_image,
            pi.url AS productImage
        FROM order_detail od
        LEFT JOIN product p ON p.id = od.product_id
        LEFT JOIN (
            SELECT pi1.product_id, pi1.url
            FROM product_image pi1
            INNER JOIN (
                SELECT product_id, MIN(id) AS min_image_id
                FROM product_image
                GROUP BY product_id
            ) first_image ON first_image.min_image_id = pi1.id
        ) pi ON pi.product_id = od.product_id
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

    return orders.map((order) => {
        const details = detailsByOrderId.get(order.id) ?? [];
        const firstDetail = details[0] ?? null;

        return {
            ...order,
            details,
            product_id: firstDetail?.product_id ?? null,
            productId: firstDetail?.product_id ?? null,
            product_name: firstDetail?.product_name ?? null,
            productName: firstDetail?.product_name ?? null,
            quantity: firstDetail?.quantity ?? null,
            subtotal_price: firstDetail?.subtotal_price ?? null,
            subtotalPrice: firstDetail?.subtotal_price ?? null,
            note: firstDetail?.note ?? null,
        };
    });
};

const insertOrderDetails = async (connection, orderId, details = []) => {
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

const replaceOrderDetails = async (connection, orderId, details = []) => {
    await connection.query('DELETE FROM order_detail WHERE order_id = ?', [orderId]);
    await insertOrderDetails(connection, orderId, details);
};

const normalizeDetailQuantity = (detail) => Number(detail.quantity ?? 0);

const validateAndReserveProductQuantities = async (connection, details = []) => {
    if (!Array.isArray(details) || details.length === 0) {
        return;
    }

    const aggregatedQuantities = new Map();

    for (const detail of details) {
        const productId = Number(detail.productId ?? detail.product_id);
        const quantity = normalizeDetailQuantity(detail);

        if (!Number.isInteger(productId) || productId <= 0) {
            const error = new Error('Sản phẩm trong đơn hàng không hợp lệ.');
            error.status = 400;
            throw error;
        }

        if (!Number.isFinite(quantity) || quantity <= 0) {
            const error = new Error('Số lượng sản phẩm phải lớn hơn 0.');
            error.status = 400;
            throw error;
        }

        aggregatedQuantities.set(productId, (aggregatedQuantities.get(productId) ?? 0) + quantity);
    }

    const productIds = [...aggregatedQuantities.keys()];
    const [products] = await connection.query(
        'SELECT id, name, quantity FROM product WHERE id IN (?) FOR UPDATE',
        [productIds]
    );

    const productsById = new Map(products.map((product) => [Number(product.id), product]));

    for (const [productId, requestedQuantity] of aggregatedQuantities.entries()) {
        const product = productsById.get(productId);

        if (!product) {
            const error = new Error(`Sản phẩm #${productId} không tồn tại.`);
            error.status = 404;
            throw error;
        }

        const availableQuantity = Number(product.quantity ?? 0);
        if (availableQuantity < requestedQuantity) {
            const error = new Error(`Sản phẩm "${product.name}" chỉ còn ${availableQuantity} chiếc.`);
            error.status = 409;
            throw error;
        }
    }

    for (const [productId, requestedQuantity] of aggregatedQuantities.entries()) {
        await connection.query(
            'UPDATE product SET quantity = quantity - ? WHERE id = ?',
            [requestedQuantity, productId]
        );
    }
};

const OrderModel = {
    getAll: async () => {
        const [rows] = await db.query(`${orderSelect} ORDER BY o.created_at DESC, o.id DESC`);
        return attachOrderDetails(rows);
    },

    getByAccountId: async (accountId) => {
        const [rows] = await db.query(`${orderSelect} WHERE o.account_id = ? ORDER BY o.created_at DESC, o.id DESC`, [accountId]);
        return attachOrderDetails(rows);
    },

    getById: async (id) => {
        const [rows] = await db.query(`${orderSelect} WHERE o.id = ?`, [id]);

        if (rows.length === 0) {
            return null;
        }

        const [order] = await attachOrderDetails(rows);
        return order;
    },

    create: async ({
        createdAt,
        paymentMethod,
        status,
        accountId,
        voucherId,
        totalPrice,
        discountAmount,
        finalPrice,
        details = [],
    }) => {
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            const [result] = await connection.query(
                `INSERT INTO ${tableName}
                (created_at, payment_method, status, account_id, voucher_id, total_price, discount_amount, final_price)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    createdAt,
                    paymentMethod,
                    status,
                    accountId,
                    voucherId ?? null,
                    totalPrice,
                    discountAmount,
                    finalPrice,
                ]
            );

            await insertOrderDetails(connection, result.insertId, details);
            await validateAndReserveProductQuantities(connection, details);
            await connection.commit();

            return result.insertId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    update: async (id, {
        createdAt,
        paymentMethod,
        status,
        accountId,
        voucherId,
        totalPrice,
        discountAmount,
        finalPrice,
        details = [],
    }) => {
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            const [result] = await connection.query(
                `UPDATE ${tableName}
                SET
                    created_at = ?,
                    payment_method = ?,
                    status = ?,
                    account_id = ?,
                    voucher_id = ?,
                    total_price = ?,
                    discount_amount = ?,
                    final_price = ?
                WHERE id = ?`,
                [
                    createdAt,
                    paymentMethod,
                    status,
                    accountId,
                    voucherId ?? null,
                    totalPrice,
                    discountAmount,
                    finalPrice,
                    id,
                ]
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
        const [result] = await db.query(`DELETE FROM ${tableName} WHERE id = ?`, [id]);
        return result.affectedRows;
    },

    updateStatus: async (id, status) => {
        const [result] = await db.query(`UPDATE ${tableName} SET status = ? WHERE id = ?`, [status, id]);
        return result.affectedRows;
    },
};

export default OrderModel;
