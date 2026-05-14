import fs from 'fs/promises';
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

const parseSpecificationFile = async (file) => {
    const workbook = XLSX.readFile(file.path);
    const sheetName = workbook.SheetNames[0];

    if (!sheetName) {
        throw new Error('Specification file is empty');
    }

    const sheet = workbook.Sheets[sheetName];
    const specificationJson = XLSX.utils.sheet_to_json(sheet, {
        defval: '',
    });

    return JSON.stringify(specificationJson);
};

const resolveSpecs = async (body, specFile, fallbackSpecs = null) => {
    const rawSpecs = typeof body.specs === 'string' ? body.specs.trim() : '';

    if (specFile) {
        return parseSpecificationFile(specFile);
    }

    if (rawSpecs) {
        return rawSpecs;
    }

    return fallbackSpecs ?? '';
};

const cleanupUploadedFiles = async (files = []) => {
    await Promise.all(
        files
            .filter((file) => file?.path)
            .map((file) => fs.unlink(file.path).catch(() => null))
    );
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

    createProduct: async (req, res, next) => {
        try {
            const { name, description, origin, warranty, quantity } = req.body;
            const importPrice = req.body.importPrice ?? req.body.import_price;
            const retailPrice = req.body.retailPrice ?? req.body.retail_price;
            const brandId = req.body.brandId ?? req.body.brand_id;
            const categoryId = req.body.categoryId ?? req.body.category_id;
            const specFile = req.files?.specFile?.[0] ?? null;
            const specs = await resolveSpecs(req.body, specFile);
            const images = getUploadedImages(req.files?.images);

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

            const specFile = req.files?.specFile?.[0] ?? null;
            const specs = await resolveSpecs(req.body, specFile, currentProduct.specs);
            const uploadedImages = getUploadedImages(req.files?.images);
            const existingImages = normalizeImageValues(req.body.existingImages ?? req.body.existing_images);
            let images = uploadedImages.length > 0 ? uploadedImages : existingImages;

            if (uploadedImages.length === 0 && existingImages.length === 0) {
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
