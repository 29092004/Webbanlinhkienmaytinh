import multer from 'multer';
import path from 'path';

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

const withSupportImageUpload = (req, res, next) => {
    uploadSupportImage(req, res, (error) => {
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
    });
};

export { uploadProductAssets, withSupportImageUpload };
