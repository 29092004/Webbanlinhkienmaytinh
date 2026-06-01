import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productUploadDir = path.resolve(__dirname, '../../uploads/products');
fs.mkdirSync(productUploadDir, { recursive: true });

const sanitizeFileName = (originalName, fallbackName) => {
    const extension = path.extname(originalName);
    const rawBaseName = path.basename(originalName, extension);
    const sanitizedBaseName = rawBaseName
        .normalize('NFC')
        .replace(/[<>:"/\\|?*\x00-\x1F]/g, '')
        .trim()
        .replace(/\s+/g, '_');

    const normalizedExtension = extension.trim();

    return {
        baseName: sanitizedBaseName || fallbackName,
        extension: normalizedExtension,
    };
};

const createUniqueFileName = (directory, originalName, fallbackName) => {
    const { baseName, extension } = sanitizeFileName(originalName, fallbackName);
    let candidateName = `${baseName}${extension}`;
    let duplicateIndex = 1;

    while (fs.existsSync(path.join(directory, candidateName))) {
        duplicateIndex += 1;
        candidateName = `${baseName}-${duplicateIndex}${extension}`;
    }

    return candidateName;
};

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

    if (file.fieldname === 'supportImage' && file.mimetype.startsWith('image/')) {
        cb(null, true);
        return;
    }

    cb(new Error('Only image files and specification files in Excel or JSON format are allowed'));
};

const uploadProductAssets = multer({
    storage: multer.memoryStorage(),
    fileFilter: uploadFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

const uploadSupportImage = multer({
    storage: multer.memoryStorage(),
    fileFilter: uploadFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
}).single('supportImage');

const collectUploadedFiles = (fileGroups = {}) =>
    Object.values(fileGroups)
        .flat()
        .filter((file) => file?.path);

const cleanupUploadedFiles = (files = []) => {
    files.forEach((file) => {
        try {
            fs.unlinkSync(file.path);
        } catch {
            // Ignore cleanup failures for aborted/failed uploads.
        }
    });
};

const withProductAssetUpload = (fields) => {
    const middleware = uploadProductAssets.fields(fields);

    return (req, res, next) => {
        middleware(req, res, (error) => {
            if (!error) {
                next();
                return;
            }

            cleanupUploadedFiles(collectUploadedFiles(req.files));

            const storageErrorFiles = (error.storageErrors ?? [])
                .map((storageError) => storageError?.file)
                .filter((file) => file?.path);
            cleanupUploadedFiles(storageErrorFiles);

            if (error instanceof multer.MulterError) {
                error.status = 400;
            }

            if (error.message === 'Request aborted' || req.aborted) {
                error.status = 499;
            }

            next(error);
        });
    };
};

const withSupportImageUpload = (req, res, next) => {
    uploadSupportImage(req, res, (error) => {
        if (!error) {
            next();
            return;
        }

        cleanupUploadedFiles(req.file ? [req.file] : []);

        if (error instanceof multer.MulterError) {
            error.status = 400;
        }

        if (error.message === 'Request aborted' || req.aborted) {
            error.status = 499;
        }

        next(error);
    });
};

export { uploadProductAssets, withProductAssetUpload };
export {
    createUniqueFileName,
    productUploadDir,
    sanitizeFileName,
    withSupportImageUpload,
};
