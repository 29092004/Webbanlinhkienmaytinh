import voucherModel from '../models/voucherModel.js';

const voucherController = {
    getVouchers: async (req, res) => {
        try {
            const rows = await voucherModel.getAll();
            res.json({ success: true, data: rows });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    getVoucherById: async (req, res) => {
        try {
            const { id } = req.params;
            const row = await voucherModel.getById(id);
            if (!row) {
                return res.status(404).json({ message: 'Voucher not found' });
            }
            res.json({ success: true, data: row });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    createVoucher: async (req, res, next) => {
        try {
            const voucherCode = req.body.voucherCode ?? req.body.voucher_code;
            const voucherValue = req.body.voucherValue ?? req.body.voucher_value;
            const expiredDate = req.body.expiredDate ?? req.body.expired_date;
            const isActive = req.body.isActive;
            const usageLimit = req.body.usageLimit;
            const useCount = req.body.useCount;
            const forSingleUse = req.body.forSingleUse ?? req.body.ForSingleUse;

            if (!voucherCode || voucherValue === undefined || !expiredDate || isActive === undefined || usageLimit === undefined || useCount === undefined || forSingleUse === undefined) {
                return res.status(400).json({ message: 'Invalid input' });
            }

            const voucherId = await voucherModel.create(voucherCode, voucherValue, expiredDate, isActive, usageLimit, useCount, forSingleUse);
            res.status(201).json({ success: true, voucherId });
        } catch (error) {
            next(error);
        }
    },

    updateVoucher: async (req, res, next) => {
        try {
            const { id } = req.params;
            const voucherCode = req.body.voucherCode ?? req.body.voucher_code;
            const voucherValue = req.body.voucherValue ?? req.body.voucher_value;
            const expiredDate = req.body.expiredDate ?? req.body.expired_date;
            const isActive = req.body.isActive;
            const usageLimit = req.body.usageLimit;
            const useCount = req.body.useCount;
            const forSingleUse = req.body.forSingleUse ?? req.body.ForSingleUse;

            if (!voucherCode || voucherValue === undefined || !expiredDate || isActive === undefined || usageLimit === undefined || useCount === undefined || forSingleUse === undefined) {
                return res.status(400).json({ message: 'Invalid input' });
            }

            const affectedRows = await voucherModel.update(id, voucherCode, voucherValue, expiredDate, isActive, usageLimit, useCount, forSingleUse);
            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Voucher not found' });
            }
            res.json({ success: true });
        } catch (error) {
            next(error);
        }
    },

    deleteVoucher: async (req, res) => {
        try {
            const { id } = req.params;
            const affectedRows = await voucherModel.delete(id);
            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Voucher not found' });
            }
            res.json({ success: true });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },
};

export default voucherController;
