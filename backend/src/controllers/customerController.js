import db from '../config/mysql.js';
import accountModel from '../models/accountModel.js';
import customerModel from '../models/customerModel.js';

const isAdminOrStaff = (role) => role === 'admin' || role === 'staff';

const canAccessCustomerRecord = (req, customerId) => (
    isAdminOrStaff(req.user?.role) || Number(req.user?.id) === Number(customerId)
);

const customerController = {
    getCustomers: async (req, res) => {
        try {
            const rows = await customerModel.getAll();
            res.json({ success: true, data: rows });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    getCustomerById: async (req, res) => {
        try {
            const { customerId } = req.params;

            if (!canAccessCustomerRecord(req, customerId)) {
                return res.status(403).json({ message: 'Forbidden' });
            }

            const row = await customerModel.getById(customerId);
            if (!row) {
                return res.status(404).json({ message: 'Customer not found' });
            }
            res.json({ success: true, data: row });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    createCustomer: async (req, res, next) => {
        try {
            const customerId = req.body.customerId ?? req.body.customer_id ?? req.body.accountId ?? req.body.account_id;
            const firstName = String(req.body.firstName ?? req.body.first_name ?? '').trim();
            const lastName = String(req.body.lastName ?? req.body.last_name ?? '').trim();
            const { email, phone, address } = req.body;

            if (!customerId || !firstName || !email || !phone || !address) {
                return res.status(400).json({ message: 'Invalid input' });
            }

            const insertedCustomerId = await customerModel.create(customerId, firstName, lastName, email, phone, address);
            res.status(201).json({ success: true, customerId: insertedCustomerId || Number(customerId) });
        } catch (error) {
            next(error);
        }
    },

    updateCustomer: async (req, res, next) => {
        try {
            const { customerId } = req.params;

            if (!canAccessCustomerRecord(req, customerId)) {
                return res.status(403).json({ message: 'Forbidden' });
            }

            const firstName = String(req.body.firstName ?? req.body.first_name ?? '').trim();
            const lastName = String(req.body.lastName ?? req.body.last_name ?? '').trim();
            const { email, phone, address } = req.body;

            if (!firstName || !email || !phone || !address) {
                return res.status(400).json({ message: 'Invalid input' });
            }

            const affectedRows = await customerModel.update(customerId, firstName, lastName, email, phone, address);
            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Customer not found' });
            }
            res.json({ success: true });
        } catch (error) {
            next(error);
        }
    },

    deleteCustomer: async (req, res) => {
        let connection;

        try {
            const { customerId } = req.params;
            const existingCustomer = await customerModel.getById(customerId);

            if (!existingCustomer) {
                return res.status(404).json({ message: 'Customer not found' });
            }

            connection = await db.getConnection();
            await connection.beginTransaction();

            await customerModel.delete(customerId, connection);
            const deletedAccounts = await accountModel.delete(customerId, connection);

            if (deletedAccounts === 0) {
                throw new Error('Account not found');
            }

            await connection.commit();
            res.json({ success: true });
        } catch (error) {
            if (connection) {
                await connection.rollback();
            }

            if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.code === 'ER_ROW_IS_REFERENCED') {
                return res.status(409).json({
                    message: 'Không thể xóa khách hàng này vì vẫn còn dữ liệu liên quan trong hệ thống.',
                });
            }

            return res.status(500).json({ message: 'Internal Server Error' });
        } finally {
            connection?.release();
        }
    },
};

export default customerController;
