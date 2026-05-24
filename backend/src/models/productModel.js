import path from 'path';
import db from '../config/mysql.js';

const table_name = 'product';

const normalizeSpecsForStorage = (specs) => {
    if (specs === null || specs === undefined || specs === '') {
        return '';
    }

    if (typeof specs === 'string') {
        return specs;
    }

    try {
        return JSON.stringify(specs);
    } catch (error) {
        return String(specs);
    }
};

const normalizeImageUrlsForStorage = (images) => {
    if (!Array.isArray(images)) {
        return [];
    }

    return images
        .flat()
        .map((url) => {
            if (url === null || url === undefined) {
                return '';
            }

            return typeof url === 'string' ? url : String(url);
        })
        .map((url) => url.trim())
        .map((url) => {
            if (!url) {
                return '';
            }

            const normalizedUrl = url.split('?')[0].split('#')[0];
            return path.basename(normalizedUrl.replace(/\\/g, '/'));
        })
        .filter(Boolean);
};

const attachProductDetails = async (products) => {
    if (products.length === 0) {
        return products;
    }

    const productIds = products.map((product) => product.id);

    const [imageRows] = await db.query(
        'SELECT id, product_id, url FROM product_image WHERE product_id IN (?) ORDER BY id ASC',
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
            url: image.url,
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
    const normalizedSpecs = normalizeSpecsForStorage(specs);
    const normalizedImages = normalizeImageUrlsForStorage(images);

    await connection.query(
        'DELETE FROM technical_specification WHERE product_id = ?',
        [productId]
    );
    await connection.query(
        'DELETE FROM product_image WHERE product_id = ?',
        [productId]
    );

    if (normalizedSpecs) {
        await connection.query(
            'INSERT INTO technical_specification (specs, product_id) VALUES (?, ?)',
            [normalizedSpecs, productId]
        );
    }

    let primaryImageId = null;
    for (const url of normalizedImages) {
        const [result] = await connection.query(
            'INSERT INTO product_image (product_id, url) VALUES (?, ?)',
            [productId, url]
        );

        if (primaryImageId === null) {
            primaryImageId = result.insertId;
        }
    }
};

const ProductModel = {
    getAll: async () => {
        const [rows] = await db.query(`
            SELECT
                p.*,
                b.brand_name,
                c.name AS category_name,
                se.sale_type,
                se.sale_value,
                se.sale_duration
            FROM ${table_name} p
            LEFT JOIN brand b ON b.brand_id = p.brand_id
            LEFT JOIN category c ON c.id = p.category_id
            LEFT JOIN sale_event se ON se.sale_id = p.sale_id
        `);
        return attachProductDetails(rows);
    },

    getById: async (id) => {
        const [rows] = await db.query(
            `SELECT
                p.*,
                b.brand_name,
                c.name AS category_name,
                se.sale_type,
                se.sale_value,
                se.sale_duration
            FROM ${table_name} p
            LEFT JOIN brand b ON b.brand_id = p.brand_id
            LEFT JOIN category c ON c.id = p.category_id
            LEFT JOIN sale_event se ON se.sale_id = p.sale_id
            WHERE p.id = ?`,
            [id]
        );
        if (rows.length === 0) {
            return null;
        }

        const [product] = await attachProductDetails([rows[0]]);
        return product;
    },

    create: async (name, description, importPrice, retailPrice, brandId, categoryId, saleId, origin, warranty, quantity, specs, images) => {
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            const [result] = await connection.query(
                `INSERT INTO ${table_name} (name, description, import_price, retail_price, brand_id, category_id, sale_id, origin, warranty, quantity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [name, description, importPrice, retailPrice, brandId, categoryId, saleId ?? null, origin, warranty, quantity]
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

    update: async (id, name, description, importPrice, retailPrice, brandId, categoryId, saleId, origin, warranty, quantity, specs, images) => {
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            const [result] = await connection.query(
                `UPDATE ${table_name} SET name = ?, description = ?, import_price = ?, retail_price = ?, brand_id = ?, category_id = ?, sale_id = ?, origin = ?, warranty = ?, quantity = ? WHERE id = ?`,
                [name, description, importPrice, retailPrice, brandId, categoryId, saleId ?? null, origin, warranty, quantity, id]
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
