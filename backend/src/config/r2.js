import { S3Client } from '@aws-sdk/client-s3';

const {
    R2_BUCKET_NAME,
    R2_ENDPOINT,
    R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY,
} = process.env;

const hasR2Config = Boolean(
    String(R2_BUCKET_NAME || '').trim() &&
    String(R2_ENDPOINT || '').trim() &&
    String(R2_ACCESS_KEY_ID || '').trim() &&
    String(R2_SECRET_ACCESS_KEY || '').trim()
);

const r2Client = hasR2Config
    ? new S3Client({
          region: 'auto',
          endpoint: R2_ENDPOINT,
          credentials: {
              accessKeyId: R2_ACCESS_KEY_ID,
              secretAccessKey: R2_SECRET_ACCESS_KEY,
          },
      })
    : null;

export {
    hasR2Config,
    r2Client,
    R2_BUCKET_NAME,
};
