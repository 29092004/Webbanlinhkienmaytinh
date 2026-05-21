import db from '../config/mysql.js';

const table_name = 'importing';

const attachImportingDetails = async (importings) => {
    if (importings.length === 0) {
        return importings;
    }

    const importingIds = importings.map((importing) => importing.id);
    const [detailRows] = await db.query(`
        SELECT
            d.id_importing,
            d.id_product,
            d.quantity,
            d.subtotalprice,
            p.name AS product_name
        FROM importing_detail d
        LEFT JOIN product p ON p.id = d.id_product
        WHERE d.id_importing IN (?)
        ORDER BY d.id_importing ASC, d.id_product ASC
    `, [importingIds]);

    const detailsByImportingId = new Map();
    for (const detail of detailRows) {
        if (!detailsByImportingId.has(detail.id_importing)) {
            detailsByImportingId.set(detail.id_importing, []);
        }
        detailsByImportingId.get(detail.id_importing).push(detail);
    }

    return importings.map((importing) => ({
        ...importing,
        details: detailsByImportingId.get(importing.id) ?? [],
        id_product: detailsByImportingId.get(importing.id)?.[0]?.id_product ?? null,
        quantity: detailsByImportingId.get(importing.id)?.[0]?.quantity ?? null,
        subtotalprice: detailsByImportingId.get(importing.id)?.[0]?.subtotalprice ?? null,
        product_name: detailsByImportingId.get(importing.id)?.[0]?.product_name ?? null,
    }));
};

const replaceImportingDetails = async (connection, importingId, details = []) => {
    await connection.query('DELETE FROM importing_detail WHERE id_importing = ?', [importingId]);

    for (const detail of details) {
        await connection.query(
            'INSERT INTO importing_detail (id_importing, id_product, quantity, subtotalprice) VALUES (?, ?, ?, ?)',
            [
                importingId,
                detail.productId ?? detail.id_product,
                detail.quantity,
                detail.subtotalPrice ?? detail.subtotalprice,
            ]
        );
    }
};

const ImportingModel = {
    getAll: async () => {
        const [rows] = await db.query(`
            SELECT
                i.*,
                s.name AS supplier_name,
                s.phonenumber AS supplier_phonenumber,
                s.email AS supplier_email,
                s.address AS supplier_address
            FROM ${table_name} i
            LEFT JOIN supplier s ON s.id = i.id_supplier
        `);
        return attachImportingDetails(rows);
    },

    getById: async (id) => {
        const [rows] = await db.query(
            `SELECT
                i.*,
                s.name AS supplier_name,
                s.phonenumber AS supplier_phonenumber,
                s.email AS supplier_email,
                s.address AS supplier_address
            FROM ${table_name} i
            LEFT JOIN supplier s ON s.id = i.id_supplier
            WHERE i.id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return null;
        }

        const [importing] = await attachImportingDetails(rows);
        return importing;
    },

    create: async (date, totalPrice, supplierId, details = []) => {
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            const [result] = await connection.query(
                `INSERT INTO ${table_name} (date, total_price, id_supplier) VALUES (?, ?, ?)`,
                [date, totalPrice, supplierId]
            );

            await replaceImportingDetails(connection, result.insertId, details);
            await connection.commit();

            return result.insertId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    update: async (id, date, totalPrice, supplierId, details = []) => {
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            const [result] = await connection.query(
                `UPDATE ${table_name} SET date = ?, total_price = ?, id_supplier = ? WHERE id = ?`,
                [date, totalPrice, supplierId, id]
            );

            if (result.affectedRows === 0) {
                await connection.rollback();
                return 0;
            }

            await replaceImportingDetails(connection, id, details);
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

export default ImportingModel;
