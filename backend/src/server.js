import 'dotenv/config';
import app from './app.js';
import db from './config/mysql.js';
import SupportModel from './models/supportModel.js';

const PORT = process.env.PORT || 9000;

const connectMySQL = async () => {
    try {
        const connection = await db.getConnection();
        console.log('Kết nối MySQL thành công');
        connection.release();
    } catch (error) {
        console.log('Lỗi MySQL:', error.message);
    }
};

const startServer = async () => {
    await connectMySQL();
    await SupportModel.ensureTables();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();
