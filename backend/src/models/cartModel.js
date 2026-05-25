import db from '../config/mysql.js';

const table_name = 'cart';

const attachCartItems = async (carts) => {
    if (carts.length === 0) {
        return carts;
    }

    const cartIds = carts.map((cart) => cart.id);
    const [itemRows] = await db.query(`
        SELECT
            ci.*,
            p.name AS product_name
        FROM cart_item ci
        LEFT JOIN product p ON p.id = ci.product_id
        WHERE ci.cart_id IN (?)
        ORDER BY ci.cart_id ASC, ci.product_id ASC
    `, [cartIds]);

    const itemsByCartId = new Map();
    for (const item of itemRows) {
        if (!itemsByCartId.has(item.cart_id)) {
            itemsByCartId.set(item.cart_id, []);
        }
        itemsByCartId.get(item.cart_id).push(item);
    }

    return carts.map((cart) => ({
        ...cart,
        items: itemsByCartId.get(cart.id) ?? [],
        product_id: itemsByCartId.get(cart.id)?.[0]?.product_id ?? null,
        product_name: itemsByCartId.get(cart.id)?.[0]?.product_name ?? null,
        quantity: itemsByCartId.get(cart.id)?.[0]?.quantity ?? null,
    }));
};

const replaceCartItems = async (connection, cartId, items = []) => {
    await connection.query('DELETE FROM cart_item WHERE cart_id = ?', [cartId]);

    for (const item of items) {
        await connection.query(
            'INSERT INTO cart_item (cart_id, product_id, quantity) VALUES (?, ?, ?)',
            [cartId, item.productId ?? item.product_id, item.quantity]
        );
    }
};

const CartModel = {
    getAll: async () => {
        const [rows] = await db.query(`
            SELECT
                c.*,
                cu.first_name AS customer_first_name,
                cu.last_name AS customer_last_name,
                cu.email AS customer_email,
                a.username AS account_username
            FROM ${table_name} c
            LEFT JOIN customer cu ON cu.customer_id = c.customer_id
            LEFT JOIN account a ON a.id = c.customer_id
        `);
        return attachCartItems(rows);
    },

    getById: async (id) => {
        const [rows] = await db.query(
            `SELECT
                c.*,
                cu.first_name AS customer_first_name,
                cu.last_name AS customer_last_name,
                cu.email AS customer_email,
                a.username AS account_username
            FROM ${table_name} c
            LEFT JOIN customer cu ON cu.customer_id = c.customer_id
            LEFT JOIN account a ON a.id = c.customer_id
            WHERE c.id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return null;
        }

        const [cart] = await attachCartItems(rows);
        return cart;
    },

    getByCustomerId: async (customerId) => {
        const [rows] = await db.query(
            `SELECT
                c.*,
                cu.first_name AS customer_first_name,
                cu.last_name AS customer_last_name,
                cu.email AS customer_email,
                a.username AS account_username
            FROM ${table_name} c
            LEFT JOIN customer cu ON cu.customer_id = c.customer_id
            LEFT JOIN account a ON a.id = c.customer_id
            WHERE c.customer_id = ?
            ORDER BY c.id DESC`,
            [customerId]
        );
        return attachCartItems(rows);
    },

    create: async (customerId, createdAt = null, items = []) => {
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            const [result] = await connection.query(
                `INSERT INTO ${table_name} (customer_id, created_at) VALUES (?, ?)`,
                [customerId, createdAt]
            );

            await replaceCartItems(connection, result.insertId, items);
            await connection.commit();

            return result.insertId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    update: async (id, customerId, createdAt = null, items = []) => {
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            const [result] = await connection.query(
                `UPDATE ${table_name} SET customer_id = ?, created_at = ? WHERE id = ?`,
                [customerId, createdAt, id]
            );

            if (result.affectedRows === 0) {
                await connection.rollback();
                return 0;
            }

            await replaceCartItems(connection, id, items);
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
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();
            await connection.query('DELETE FROM cart_item WHERE cart_id = ?', [id]);

            const [result] = await connection.query(
                `DELETE FROM ${table_name} WHERE id = ?`,
                [id]
            );

            await connection.commit();
            return result.affectedRows;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },
};

export default CartModel;
