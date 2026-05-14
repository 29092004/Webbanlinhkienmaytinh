import db from '../config/mysql.js';

const table_name = 'product';

const attachProductDetails = async (products) => {
    if (products.length === 0) {
        return products;
    }

    const productIds = products.map((product) => product.id);

    const [imageRows] = await db.query(
        'SELECT id, product_id, URL FROM product_image WHERE product_id IN (?) ORDER BY id ASC',
        [productIds]
    );
    const [specRows] = await db.query(
        'SELECT id, product_id, specs FROM technical_specification WHERE product_id IN (?) ORDER BY id ASC',
        [productIds]
    );

    const imagesByProductId = new Map();
    for (const image of imageRows) {
        if (!imagesByProductId.has(image.product_id)) {
            imagesByProductId.set(image.product_id, []);
        }
        imagesByProductId.get(image.product_id).push({
            id: image.id,
            url: image.URL,
        });
    }

    const specsByProductId = new Map();
    for (const spec of specRows) {
        if (!specsByProductId.has(spec.product_id)) {
            specsByProductId.set(spec.product_id, spec.specs);
        }
    }

    return products.map((product) => ({
        ...product,
        specs: specsByProductId.get(product.id) ?? null,
        images: imagesByProductId.get(product.id) ?? [],
    }));
};

const replaceProductDetails = async (connection, productId, specs, images) => {
    await connection.query(
        'DELETE FROM technical_specification WHERE product_id = ?',
        [productId]
    );
    await connection.query(
        'DELETE FROM product_image WHERE product_id = ?',
        [productId]
    );

    if (specs) {
        await connection.query(
            'INSERT INTO technical_specification (specs, product_id) VALUES (?, ?)',
            [specs, productId]
        );
    }

    let primaryImageId = null;
    for (const url of images) {
        const [result] = await connection.query(
            'INSERT INTO product_image (product_id, URL) VALUES (?, ?)',
            [productId, url]
        );

        if (primaryImageId === null) {
            primaryImageId = result.insertId;
        }
    }

    await connection.query(
        `UPDATE ${table_name} SET image_id = ? WHERE id = ?`,
        [primaryImageId, productId]
    );
};

const ProductModel = {
    getAll: async () => {
        const [rows] = await db.query(`
            SELECT *
            FROM ${table_name}
        `);
        return attachProductDetails(rows);
    },

    getById: async (id) => {
        const [rows] = await db.query(
            `SELECT * FROM ${table_name} WHERE id = ?`,
            [id]
        );
        if (rows.length === 0) {
            return null;
        }

        const [product] = await attachProductDetails([rows[0]]);
        return product;
    },

    create: async (name, description, importPrice, retailPrice, brandId, categoryId, origin, warranty, quantity, specs, images) => {
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            const [result] = await connection.query(
                `INSERT INTO ${table_name} (name, description, import_price, retail_price, image_id, brand_id, category_id, origin, warranty, quantity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [name, description, importPrice, retailPrice, null, brandId, categoryId, origin, warranty, quantity]
            );

            await replaceProductDetails(connection, result.insertId, specs, images);
            await connection.commit();

            return result.insertId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    update: async (id, name, description, importPrice, retailPrice, brandId, categoryId, origin, warranty, quantity, specs, images) => {
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            const [result] = await connection.query(
                `UPDATE ${table_name} SET name = ?, description = ?, import_price = ?, retail_price = ?, brand_id = ?, category_id = ?, origin = ?, warranty = ?, quantity = ? WHERE id = ?`,
                [name, description, importPrice, retailPrice, brandId, categoryId, origin, warranty, quantity, id]
            );

            if (result.affectedRows === 0) {
                await connection.rollback();
                return 0;
            }

            await replaceProductDetails(connection, id, specs, images);
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

export default ProductModel;
