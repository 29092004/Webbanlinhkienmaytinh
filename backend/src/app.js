import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './routes/index.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const allowedOrigins = (
    process.env.FRONTEND_URLS ||
    'http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174'
)
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
const localhostPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

app.use(
    cors({
        origin(origin, callback) {
            if (
                !origin ||
                allowedOrigins.includes(origin) ||
                localhostPattern.test(origin)
            ) {
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
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

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
