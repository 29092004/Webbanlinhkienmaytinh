import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { R2_BUCKET_NAME, hasR2Config, r2Client } from '../config/r2.js';
import { sanitizeFileName } from '../middlewares/upload.js';

const ensureR2Ready = () => {
    if (!hasR2Config || !r2Client || !String(R2_BUCKET_NAME || '').trim()) {
        const error = new Error('Cloudflare R2 is not configured');
        error.status = 500;
        throw error;
    }
};

const createObjectKey = (originalName, index = 1) => {
    const { baseName, extension } = sanitizeFileName(originalName, 'image');
    const timestamp = Date.now();

    return `${baseName}_${timestamp}_${index}${extension || '.jpg'}`;
};

const uploadBufferToR2 = async ({ buffer, objectKey, contentType }) => {
    ensureR2Ready();

    await r2Client.send(
        new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: objectKey,
            Body: buffer,
            ContentType: contentType || 'application/octet-stream',
        })
    );

    return objectKey;
};

const uploadMultipleFilesToR2 = async (files = []) => {
    ensureR2Ready();

    if (!Array.isArray(files) || files.length === 0) {
        return [];
    }

    const uploadedKeys = [];

    try {
        for (let index = 0; index < files.length; index += 1) {
            const file = files[index];

            if (!file?.buffer) {
                continue;
            }

            const objectKey = createObjectKey(file.originalname, index + 1);
            const uploadedKey = await uploadBufferToR2({
                buffer: file.buffer,
                objectKey,
                contentType: file.mimetype,
            });

            uploadedKeys.push(uploadedKey);
        }

        return uploadedKeys;
    } catch (error) {
        await deleteMultipleFilesFromR2(uploadedKeys);
        const uploadError = new Error(`Upload image to Cloudflare R2 failed: ${error.message}`);
        uploadError.status = error.status || 500;
        throw uploadError;
    }
};

const deleteFileFromR2 = async (objectKey) => {
    ensureR2Ready();

    if (!objectKey) {
        return false;
    }

    await r2Client.send(
        new DeleteObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: String(objectKey).trim(),
        })
    );

    return true;
};

const deleteMultipleFilesFromR2 = async (objectKeys = []) => {
    if (!hasR2Config || !r2Client) {
        return;
    }

    const keys = Array.from(
        new Set(
            objectKeys
                .map((key) => String(key || '').trim())
                .filter(Boolean)
        )
    );

    await Promise.all(
        keys.map((key) => deleteFileFromR2(key).catch(() => false))
    );
};

export {
    deleteFileFromR2,
    deleteMultipleFilesFromR2,
    uploadMultipleFilesToR2,
};
