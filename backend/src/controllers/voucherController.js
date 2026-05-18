import voucherModel from '../models/voucherModel.js';

const normalizeDateInput = (value) => {
    if (!value) {
        return '';
    }

    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value.trim())) {
        return value.trim();
    }

    if (typeof value === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(value.trim())) {
        const [day, month, year] = value.trim().split('/');
        return `${year}-${month}-${day}`;
    }

    const parsedDate = new Date(value);

    if (Number.isNaN(parsedDate.getTime())) {
        return '';
    }

    return parsedDate.toISOString().slice(0, 10);
};

const parseOptionalInteger = (value, fallback = undefined) => {
    if (value === undefined || value === null || value === '') {
        return fallback;
    }

    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? fallback : parsed;
};

const parseRequiredNumber = (value) => {
    if (value === undefined || value === null || value === '') {
        return null;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
};

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
            const voucherCode = String(req.body.voucherCode ?? req.body.voucher_code ?? '').trim();
            const voucherValue = parseRequiredNumber(req.body.voucherValue ?? req.body.voucher_value);
            const expiredDate = normalizeDateInput(req.body.expiredDate ?? req.body.expired_date);
            const isActive = parseOptionalInteger(req.body.isActive, 1);
            const usageLimit = parseOptionalInteger(req.body.usageLimit);
            const useCount = parseOptionalInteger(req.body.useCount, 0);
            const forSingleUse = parseOptionalInteger(req.body.forSingleUse, 0);

            if (!voucherCode) {
                return res.status(400).json({ message: 'Vui long nhap ma voucher.' });
            }

            if (voucherValue === null || voucherValue < 0) {
                return res.status(400).json({ message: 'Gia tri giam khong hop le.' });
            }

            if (!expiredDate) {
                return res.status(400).json({ message: 'Ngay het han khong hop le.' });
            }

            if (usageLimit === undefined || usageLimit < 0) {
                return res.status(400).json({ message: 'So luot dung toi da khong hop le.' });
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
            const voucherCode = String(req.body.voucherCode ?? req.body.voucher_code ?? '').trim();
            const voucherValue = parseRequiredNumber(req.body.voucherValue ?? req.body.voucher_value);
            const expiredDate = normalizeDateInput(req.body.expiredDate ?? req.body.expired_date);
            const isActive = parseOptionalInteger(req.body.isActive, 1);
            const usageLimit = parseOptionalInteger(req.body.usageLimit);
            let useCount = parseOptionalInteger(req.body.useCount);
            const forSingleUse = parseOptionalInteger(req.body.forSingleUse, 0);

            if (!voucherCode) {
                return res.status(400).json({ message: 'Vui long nhap ma voucher.' });
            }

            if (voucherValue === null || voucherValue < 0) {
                return res.status(400).json({ message: 'Gia tri giam khong hop le.' });
            }

            if (!expiredDate) {
                return res.status(400).json({ message: 'Ngay het han khong hop le.' });
            }

            if (usageLimit === undefined || usageLimit < 0) {
                return res.status(400).json({ message: 'So luot dung toi da khong hop le.' });
            }

            if (useCount === undefined) {
                const existingVoucher = await voucherModel.getById(id);

                if (!existingVoucher) {
                    return res.status(404).json({ message: 'Voucher not found' });
                }

                useCount = existingVoucher.useCount ?? 0;
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
