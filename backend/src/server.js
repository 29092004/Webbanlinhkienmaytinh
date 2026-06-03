import 'dotenv/config';
import app from './app.js';
import db from './config/mysql.js';
import otpModel from './models/otpModel.js';
import pendingVnpayOrderModel from './models/pendingVnpayOrderModel.js';
import saleEventModel from './models/saleEventModel.js';
import SupportModel from './models/supportModel.js';

const PORT = process.env.PORT || 9000;

const connectMySQL = async () => {
    const connection = await db.getConnection();
    console.log('Kết nối MySQL thành công');
    connection.release();
};

const startServer = async () => {
    try {
        await connectMySQL();
        await otpModel.ensureTable();
        await saleEventModel.ensureSchema();
        await SupportModel.ensureTables();
        await pendingVnpayOrderModel.ensureTable();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Không thể khởi động server:', error);
        process.exit(1);
    }
};

startServer();
