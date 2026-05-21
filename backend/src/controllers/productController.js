import fs from 'fs/promises';
import path from 'path';
import XLSX from 'xlsx';
import productModel from '../models/productModel.js';

const normalizeImageValues = (value) => {
    if (typeof value === 'string') {
        const trimmedValue = value.trim();

        if (!trimmedValue) {
            return [];
        }

        if (trimmedValue.startsWith('[')) {
            try {
                const parsedValue = JSON.parse(trimmedValue);
                return normalizeImageValues(parsedValue);
            } catch (error) {
                return [trimmedValue];
            }
        }
    }

    if (Array.isArray(value)) {
        return value
            .map((item) => typeof item === 'string' ? item.trim() : '')
            .filter(Boolean);
    }

    if (typeof value === 'string' && value.trim()) {
        return [value.trim()];
    }

    return [];
};

const getUploadedImages = (files) => {
    if (!Array.isArray(files) || files.length === 0) {
        return [];
    }

    return files.map((file) => `/uploads/products/${file.filename}`);
};

const normalizeImageSlots = (value) => {
    if (typeof value === 'string') {
        const trimmedValue = value.trim();

        if (!trimmedValue) {
            return [];
        }

        try {
            const parsedValue = JSON.parse(trimmedValue);
            return normalizeImageSlots(parsedValue);
        } catch (error) {
            return [];
        }
    }

    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .map((item) => {
            if (!item || typeof item !== 'object') {
                return null;
            }

            if (item.type === 'existing' && typeof item.url === 'string' && item.url.trim()) {
                return {
                    type: 'existing',
                    url: item.url.trim(),
                };
            }

            if (item.type === 'upload' && Number.isInteger(Number(item.uploadIndex))) {
                return {
                    type: 'upload',
                    uploadIndex: Number(item.uploadIndex),
                };
            }

            return null;
        })
        .filter(Boolean);
};

const resolveOrderedImages = ({ uploadedImages, existingImages, imageSlots }) => {
    if (imageSlots.length > 0) {
        return imageSlots
            .map((slot) => {
                if (slot.type === 'existing') {
                    return existingImages.includes(slot.url) ? slot.url : null;
                }

                return uploadedImages[slot.uploadIndex] ?? null;
            })
            .filter(Boolean);
    }

    if (uploadedImages.length > 0) {
        return uploadedImages;
    }

    return existingImages;
};

const normalizeSheetRows = (rows = []) => {
    const meaningfulRows = rows.filter((row) =>
        Array.isArray(row) && row.some((cell) => String(cell ?? '').trim() !== '')
    );

    if (meaningfulRows.length === 0) {
        return [];
    }

    if (meaningfulRows.length === 1) {
        return meaningfulRows[0].map((value) => String(value ?? '').trim()).filter(Boolean);
    }

    const [headerRow, ...dataRows] = meaningfulRows;
    const normalizedHeaders = headerRow.map((header, index) => {
        const normalizedHeader = String(header ?? '').trim();
        return normalizedHeader || `column_${index + 1}`;
    });

    const mappedRows = dataRows
        .filter((row) => row.some((cell) => String(cell ?? '').trim() !== ''))
        .map((row) => {
            const entry = {};

            normalizedHeaders.forEach((header, index) => {
                entry[header] = row[index] ?? '';
            });

            return entry;
        });

    if (mappedRows.length > 0) {
        return mappedRows;
    }

    return meaningfulRows.map((row) =>
        row.map((value) => String(value ?? '').trim()).filter(Boolean)
    );
};

const parseSpecificationFile = async (file) => {
    const extension = path.extname(file.originalname).toLowerCase();

    if (extension === '.json') {
        const content = await fs.readFile(file.path, 'utf8');
        const parsedJson = JSON.parse(content);
        return JSON.stringify(parsedJson);
    }

    const workbook = XLSX.readFile(file.path);
    const sheetNames = workbook.SheetNames ?? [];

    if (sheetNames.length === 0) {
        throw new Error('Specification file is empty');
    }

    for (const sheetName of sheetNames) {
        const sheet = workbook.Sheets[sheetName];

        if (!sheet) {
            continue;
        }

        const specificationJson = XLSX.utils.sheet_to_json(sheet, {
            defval: '',
        });

        if (Array.isArray(specificationJson) && specificationJson.length > 0) {
            return JSON.stringify(specificationJson);
        }

        const matrixRows = XLSX.utils.sheet_to_json(sheet, {
            header: 1,
            defval: '',
            blankrows: false,
        });
        const normalizedRows = normalizeSheetRows(matrixRows);

        if (normalizedRows.length > 0) {
            return JSON.stringify(normalizedRows);
        }
    }

    throw new Error('Specification file has no readable technical data');
};

const normalizeSpecsValue = (value) => {
    if (value === null || value === undefined || value === '') {
        return '';
    }

    if (typeof value === 'string') {
        return value;
    }

    try {
        return JSON.stringify(value);
    } catch (error) {
        return String(value);
    }
};

const resolveSpecs = async (body, specFile, fallbackSpecs = null) => {
    const rawSpecs = typeof body.specs === 'string' ? body.specs.trim() : '';

    if (specFile) {
        return parseSpecificationFile(specFile);
    }

    if (rawSpecs) {
        return rawSpecs;
    }

    return normalizeSpecsValue(fallbackSpecs);
};

const cleanupUploadedFiles = async (files = []) => {
    await Promise.all(
        files
            .filter((file) => file?.path)
            .map((file) => fs.unlink(file.path).catch(() => null))
    );
};

const normalizeSaleId = (value, fallback = null) => {
    if (value === undefined) {
        return fallback;
    }

    if (value === null || value === '' || value === 'null' || value === 'undefined') {
        return null;
    }

    return value;
};

const productController = {
    getProducts: async (req, res) => {
        try {
            const rows = await productModel.getAll();
            res.json({ success: true, data: rows });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    getProductById: async (req, res) => {
        try {
            const { id } = req.params;
            const row = await productModel.getById(id);
            if (!row) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.json({ success: true, data: row });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    previewSpecificationFile: async (req, res, next) => {
        try {
            const specFile = req.files?.specFile?.[0] ?? null;

            if (!specFile) {
                return res.status(400).json({ message: 'Specification file is required' });
            }

            const specs = await parseSpecificationFile(specFile);
            res.json({
                success: true,
                data: JSON.parse(specs),
            });
        } catch (error) {
            next(error);
        } finally {
            await cleanupUploadedFiles(req.files?.specFile ?? []);
        }
    },

    createProduct: async (req, res, next) => {
        try {
            const { name, description, origin, warranty, quantity } = req.body;
            const importPrice = req.body.importPrice ?? req.body.import_price;
            const retailPrice = req.body.retailPrice ?? req.body.retail_price;
            const brandId = req.body.brandId ?? req.body.brand_id;
            const categoryId = req.body.categoryId ?? req.body.category_id;
            const saleId = normalizeSaleId(req.body.saleId ?? req.body.sale_id, null);
            const specFile = req.files?.specFile?.[0] ?? null;
            const specs = await resolveSpecs(req.body, specFile);
            const uploadedImages = getUploadedImages(req.files?.images);
            const imageSlots = normalizeImageSlots(req.body.imageSlots ?? req.body.image_slots);
            const images = resolveOrderedImages({
                uploadedImages,
                existingImages: [],
                imageSlots,
            });

            if (!name || description === undefined || importPrice === undefined || retailPrice === undefined || !brandId || !categoryId || !origin || warranty === undefined || quantity === undefined) {
                return res.status(400).json({ message: 'Invalid input' });
            }

            const productId = await productModel.create(
                name,
                description,
                importPrice,
                retailPrice,
                brandId,
                categoryId,
                saleId,
                origin,
                warranty,
                quantity,
                specs,
                images
            );

            res.status(201).json({ success: true, productId });
        } catch (error) {
            next(error);
        } finally {
            await cleanupUploadedFiles(req.files?.specFile ?? []);
        }
    },

    updateProduct: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { name, description, origin, warranty, quantity } = req.body;
            const importPrice = req.body.importPrice ?? req.body.import_price;
            const retailPrice = req.body.retailPrice ?? req.body.retail_price;
            const brandId = req.body.brandId ?? req.body.brand_id;
            const categoryId = req.body.categoryId ?? req.body.category_id;
            const currentProduct = await productModel.getById(id);
            if (!currentProduct) {
                return res.status(404).json({ message: 'Product not found' });
            }
            const saleId = normalizeSaleId(
                req.body.saleId ?? req.body.sale_id,
                currentProduct.sale_id ?? null
            );

            const specFile = req.files?.specFile?.[0] ?? null;
            const specs = await resolveSpecs(req.body, specFile, currentProduct.specs);
            const uploadedImages = getUploadedImages(req.files?.images);
            const existingImages = normalizeImageValues(req.body.existingImages ?? req.body.existing_images);
            const imageSlots = normalizeImageSlots(req.body.imageSlots ?? req.body.image_slots);
            const hasExplicitImageSlots = typeof (req.body.imageSlots ?? req.body.image_slots) !== 'undefined';
            let images = resolveOrderedImages({
                uploadedImages,
                existingImages,
                imageSlots,
            });

            if (!hasExplicitImageSlots && uploadedImages.length === 0 && existingImages.length === 0) {
                images = currentProduct.images.map((image) => image.url);
            }

            if (!name || description === undefined || importPrice === undefined || retailPrice === undefined || !brandId || !categoryId || !origin || warranty === undefined || quantity === undefined) {
                return res.status(400).json({ message: 'Invalid input' });
            }

            const affectedRows = await productModel.update(
                id,
                name,
                description,
                importPrice,
                retailPrice,
                brandId,
                categoryId,
                saleId,
                origin,
                warranty,
                quantity,
                specs,
                images
            );

            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.json({ success: true });
        } catch (error) {
            next(error);
        } finally {
            await cleanupUploadedFiles(req.files?.specFile ?? []);
        }
    },

    deleteProduct: async (req, res) => {
        try {
            const { id } = req.params;
            const affectedRows = await productModel.delete(id);
            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.json({ success: true });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },
};

export default productController;
