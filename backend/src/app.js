import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import apiRoutes from './routes/index.js';

const app = express();
const isProduction = process.env.NODE_ENV === 'production';
const allowedOrigins = (
    process.env.FRONTEND_URLS ||
    (isProduction ? '' : 'https://webbanlinhkienmaytinh.vercel.app,https://webbanlinhkienmaytinh-git-develop-vinhs-projects-b1a0df0d.vercel.app,https://webbanlinhkienmaytinh-bwyvlf7if-vinhs-projects-b1a0df0d.vercel.app')
)
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
const localhostPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
const allowVercelPreviews =
    process.env.ALLOW_VERCEL_PREVIEWS === 'true' ||
    allowedOrigins.some((origin) => origin.endsWith('.vercel.app'));

function isAllowedOrigin(origin) {
    if (!origin) {
        return true;
    }

    if (allowedOrigins.includes(origin)) {
        return true;
    }

    if (!isProduction && localhostPattern.test(origin)) {
        return true;
    }

    if (!allowVercelPreviews) {
        return false;
    }

    try {
        const parsedOrigin = new URL(origin);
        return parsedOrigin.protocol === 'https:' && parsedOrigin.hostname.endsWith('.vercel.app');
    } catch {
        return false;
    }
}

app.use(
    cors({
        origin(origin, callback) {
            if (isAllowedOrigin(origin)) {
                return callback(null, true);
            }

            return callback(new Error('CORS origin is not allowed'));
        },
        credentials: true,
    })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Backend API is running',
    });
});

app.use('/api', apiRoutes);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});

app.use((error, req, res, next) => {
    const statusCode = error.status || error.statusCode || 500;
    const isAbortedRequest = statusCode === 499 || error.message === 'Request aborted' || req.aborted;

    if (!isAbortedRequest) {
        console.error(error);
    }

    if (res.headersSent || isAbortedRequest) {
        return;
    }

    res.status(statusCode).json({
        success: false,
        message: error.message || 'Internal Server Error',
    });
});

export default app;
