import bcrypt from 'bcrypt';
import accountModel from '../models/accountModel.js';

const ALLOWED_ROLES = ['admin', 'staff', 'user'];
const sanitizeAccount = ({ password, refresh_token, ...account }) => account;

const accountController = {
    getAccounts: async (req, res) => {
        try {
            const rows = await accountModel.getAll();
            res.json({ success: true, data: rows.map(sanitizeAccount) });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    getAccountById: async (req, res) => {
        try {
            const { id } = req.params;
            const row = await accountModel.getById(id);
            if (!row) {
                return res.status(404).json({ message: 'Account not found' });
            }
            res.json({ success: true, data: sanitizeAccount(row) });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    createAccount: async (req, res, next) => {
        try {
            const { username, password, role } = req.body;
            if (!username || !password || !role) {
                return res.status(400).json({ message: 'Username, password and role are required' });
            }

            if (!ALLOWED_ROLES.includes(role)) {
                return res.status(400).json({ message: 'Role must be admin, staff or user' });
            }

            const existingAccount = await accountModel.findByUsername(username);
            if (existingAccount) {
                return res.status(400).json({ message: 'Username already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const accountId = await accountModel.create(username, hashedPassword, role, null);
            res.status(201).json({ success: true, accountId });
        } catch (error) {
            next(error);
        }
    },

    updateAccount: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { username, password, role } = req.body;
            if (!username || !password || !role) {
                return res.status(400).json({ message: 'Invalid input' });
            }

            if (!ALLOWED_ROLES.includes(role)) {
                return res.status(400).json({ message: 'Role must be admin, staff or user' });
            }

            const existingAccount = await accountModel.findByUsername(username);
            if (existingAccount && String(existingAccount.id) !== String(id)) {
                return res.status(400).json({ message: 'Username already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const affectedRows = await accountModel.update(id, username, hashedPassword, role, null);
            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Account not found' });
            }
            res.json({ success: true });
        } catch (error) {
            next(error);
        }
    },

    deleteAccount: async (req, res) => {
        try {
            const { id } = req.params;
            const affectedRows = await accountModel.delete(id);
            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Account not found' });
            }
            res.json({ success: true });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },
};

export default accountController;
