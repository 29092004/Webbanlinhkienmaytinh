import multer from 'multer';
import path from 'path';

const allowedSpecExtensions = new Set(['.xlsx', '.xls', '.json']);

const sanitizeFileName = (originalName, fallbackName = 'file') => {
    const extension = path.extname(originalName || '').toLowerCase();
    const rawBaseName = path.basename(originalName || '', extension);
    const sanitizedBaseName = rawBaseName
        .normalize('NFC')
        .replace(/[<>:"/\\|?*\x00-\x1F]/g, '')
        .trim()
        .replace(/\s+/g, '_')
        .replace(/_+/g, '_');

    return {
        baseName: sanitizedBaseName || fallbackName,
        extension,
    };
};

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

const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: uploadFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

const handleUploadError = (error, req, res, next) => {
    if (!error) {
        next();
        return;
    }

    if (error instanceof multer.MulterError) {
        error.status = 400;
    }

    if (error.message === 'Request aborted' || req.aborted) {
        error.status = 499;
    }

    next(error);
};

const uploadProductAssets = upload.fields([
    { name: 'images' },
    { name: 'specFile', maxCount: 1 },
]);

const uploadProductSpecPreview = upload.fields([
    { name: 'specFile', maxCount: 1 },
]);

const withUploadProductAssets = (req, res, next) =>
    uploadProductAssets(req, res, (error) => handleUploadError(error, req, res, next));

const withUploadProductSpecPreview = (req, res, next) =>
    uploadProductSpecPreview(req, res, (error) => handleUploadError(error, req, res, next));

export {
    sanitizeFileName,
    withUploadProductAssets,
    withUploadProductSpecPreview,
};
