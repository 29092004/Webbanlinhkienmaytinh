import db from '../config/mysql.js';

const table_name = 'product';
const PRODUCT_SELECT = `
    SELECT
        p.*,
        b.brand_name,
        c.name AS category_name,
        se.sale_type,
        se.sale_value,
        se.start_date,
        se.end_date,
        se.is_active AS sale_is_active,
        CASE
            WHEN p.sale_id IS NOT NULL
                AND COALESCE(se.is_active, 0) = 1
                AND (se.start_date IS NULL OR se.start_date <= NOW())
                AND (se.end_date IS NULL OR se.end_date >= NOW())
            THEN 1
            ELSE 0
        END AS sale_is_currently_active
    FROM ${table_name} p
    LEFT JOIN brand b ON b.brand_id = p.brand_id
    LEFT JOIN category c ON c.id = p.category_id
    LEFT JOIN sale_event se ON se.sale_id = p.sale_id
`;

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

            const normalizedUrl = url.split('?')[0].split('#')[0].replace(/\\/g, '/');
            const uploadsProductsPrefix = '/uploads/products/';
            const uploadsProductsWithoutLeadingSlash = 'uploads/products/';

            if (/^https?:\/\//i.test(normalizedUrl)) {
                try {
                    const parsedUrl = new URL(normalizedUrl);
                    const pathname = parsedUrl.pathname.replace(/\\/g, '/');

                    if (pathname.startsWith(uploadsProductsPrefix)) {
                        return pathname.slice(uploadsProductsPrefix.length);
                    }

                    return pathname.replace(/^\/+/, '');
                } catch {
                    return normalizedUrl.replace(/^\/+/, '');
                }
            }

            if (normalizedUrl.startsWith(uploadsProductsPrefix)) {
                return normalizedUrl.slice(uploadsProductsPrefix.length);
            }

            if (normalizedUrl.startsWith(uploadsProductsWithoutLeadingSlash)) {
                return normalizedUrl.slice(uploadsProductsWithoutLeadingSlash.length);
            }

            if (normalizedUrl.startsWith('products/')) {
                return normalizedUrl.slice('products/'.length);
            }

            return normalizedUrl.replace(/^\/+/, '');
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

const buildProductFilterQuery = ({
    search = '',
    categoryNames = [],
    brandNames = [],
    minPrice = null,
    maxPrice = null,
}) => {
    const whereClauses = [];
    const params = [];

    const normalizedSearch = String(search || '').trim();
    if (normalizedSearch) {
        whereClauses.push('LOWER(p.name) LIKE ?');
        params.push(`%${normalizedSearch.toLowerCase()}%`);
    }

    if (Array.isArray(categoryNames) && categoryNames.length > 0) {
        whereClauses.push(`c.name IN (${categoryNames.map(() => '?').join(', ')})`);
        params.push(...categoryNames);
    }

    if (Array.isArray(brandNames) && brandNames.length > 0) {
        whereClauses.push(`b.brand_name IN (${brandNames.map(() => '?').join(', ')})`);
        params.push(...brandNames);
    }

    if (Number.isFinite(Number(minPrice)) && Number(minPrice) > 0) {
        whereClauses.push('p.retail_price >= ?');
        params.push(Number(minPrice));
    }

    if (Number.isFinite(Number(maxPrice)) && Number(maxPrice) > 0) {
        whereClauses.push('p.retail_price <= ?');
        params.push(Number(maxPrice));
    }

    return {
        whereSql: whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '',
        params,
    };
};

const resolveSortSql = (sortBy = 'newest') => {
    switch (String(sortBy || '').trim()) {
        case 'price-asc':
            return 'ORDER BY p.retail_price ASC, p.id DESC';
        case 'price-desc':
            return 'ORDER BY p.retail_price DESC, p.id DESC';
        case 'oldest':
            return 'ORDER BY p.id ASC';
        case 'newest':
        default:
            return 'ORDER BY p.id DESC';
    }
};

const ProductModel = {
    getAll: async () => {
        const [rows] = await db.query(PRODUCT_SELECT);
        return attachProductDetails(rows);
    },

    getPaged: async ({
        page = 1,
        limit = 8,
        search = '',
        categoryNames = [],
        brandNames = [],
        minPrice = null,
        maxPrice = null,
        sortBy = 'newest',
    } = {}) => {
        const normalizedPage = Math.max(1, Number(page) || 1);
        const normalizedLimit = Math.max(1, Math.min(50, Number(limit) || 8));
        const offset = (normalizedPage - 1) * normalizedLimit;
        const { whereSql, params } = buildProductFilterQuery({
            search,
            categoryNames,
            brandNames,
            minPrice,
            maxPrice,
        });
        const sortSql = resolveSortSql(sortBy);

        const [[countRow]] = await db.query(
            `
                SELECT COUNT(*) AS total
                FROM ${table_name} p
                LEFT JOIN brand b ON b.brand_id = p.brand_id
                LEFT JOIN category c ON c.id = p.category_id
                ${whereSql}
            `,
            params
        );

        const totalItems = Number(countRow?.total || 0);
        const [rows] = await db.query(
            `
                ${PRODUCT_SELECT}
                ${whereSql}
                ${sortSql}
                LIMIT ? OFFSET ?
            `,
            [...params, normalizedLimit, offset]
        );

        return {
            rows: await attachProductDetails(rows),
            pagination: {
                page: normalizedPage,
                limit: normalizedLimit,
                totalItems,
                totalPages: Math.max(1, Math.ceil(totalItems / normalizedLimit)),
            },
        };
    },

    getById: async (id) => {
        const [rows] = await db.query(
            `${PRODUCT_SELECT}
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
