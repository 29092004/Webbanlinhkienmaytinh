import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productUploadDir = path.resolve(__dirname, '../../uploads/products');
const specUploadDir = path.resolve(__dirname, '../../uploads/specs-temp');
fs.mkdirSync(productUploadDir, { recursive: true });
fs.mkdirSync(specUploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'specFile') {
            cb(null, specUploadDir);
            return;
        }

        cb(null, productUploadDir);
    },
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, extension)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

        cb(null, `${Date.now()}-${baseName || 'product'}${extension}`);
    },
});

const allowedSpecExtensions = new Set(['.xlsx', '.xls', '.json']);

const uploadFileFilter = (req, file, cb) => {
    if (file.fieldname === 'images' && file.mimetype.startsWith('image/')) {
        cb(null, true);
        return;
    }

    if (file.fieldname === 'specFile' && allowedSpecExtensions.has(path.extname(file.originalname).toLowerCase())) {
        cb(null, true);
        return;
    }

    cb(new Error('Only image files and specification files in Excel or JSON format are allowed'));
};

const uploadProductAssets = multer({
    storage,
    fileFilter: uploadFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

export { uploadProductAssets };
