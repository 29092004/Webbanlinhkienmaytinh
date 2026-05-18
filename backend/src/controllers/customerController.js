import customerModel from '../models/customerModel.js';

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
        try {
            const { customerId } = req.params;
            const affectedRows = await customerModel.delete(customerId);
            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Customer not found' });
            }
            res.json({ success: true });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },
};

export default customerController;
