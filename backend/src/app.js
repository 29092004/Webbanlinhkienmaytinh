import cookieParser from 'cookie-parser';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './routes/index.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    console.error(error);
    res.status(500).json({
        success: false,
        message: error.message || 'Internal Server Error',
    });
});

export default app;
