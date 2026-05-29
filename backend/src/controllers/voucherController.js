import voucherModel from '../models/voucherModel.js';

const ALLOWED_DISCOUNT_TYPES = new Set(['PERCENT', 'FIXED']);

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

const parseOptionalNumber = (value, fallback = undefined) => {
    if (value === undefined || value === null || value === '') {
        return fallback;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeVoucherPayload = (body = {}, fallbackVoucher = null) => {
    const voucherCode = String(body.voucherCode ?? body.voucher_code ?? fallbackVoucher?.voucherCode ?? '').trim().toUpperCase();
    const discountType = String(body.discountType ?? body.discount_type ?? fallbackVoucher?.discountType ?? 'PERCENT').trim().toUpperCase();
    const discountValue = parseOptionalNumber(body.discountValue ?? body.discount_value, fallbackVoucher?.discountValue);
    const minOrderValue = parseOptionalNumber(body.minOrderValue ?? body.min_order_value, fallbackVoucher?.minOrderValue ?? 0);
    const maxDiscountValue = parseOptionalNumber(body.maxDiscountValue ?? body.max_discount_value, fallbackVoucher?.maxDiscountValue ?? null);
    const startDate = normalizeDateInput(body.startDate ?? body.start_date ?? fallbackVoucher?.startDate);
    const expiredDate = normalizeDateInput(body.expiredDate ?? body.expired_date ?? fallbackVoucher?.expiredDate);
    const usageLimit = parseOptionalInteger(body.usageLimit ?? body.usage_limit, fallbackVoucher?.usageLimit ?? 0);
    const usedCount = parseOptionalInteger(body.usedCount ?? body.used_count, fallbackVoucher?.usedCount ?? 0);
    const isActive = parseOptionalInteger(body.isActive ?? body.is_active, fallbackVoucher?.isActive ?? 1);
    const usagePerCustomer = parseOptionalInteger(
        body.usagePerCustomer ?? body.usage_per_customer,
        fallbackVoucher?.usagePerCustomer ?? 1
    );

    return {
        voucherCode,
        discountType,
        discountValue,
        minOrderValue,
        maxDiscountValue,
        startDate,
        expiredDate,
        usageLimit,
        usedCount,
        isActive,
        usagePerCustomer,
    };
};

const validateVoucherPayload = (payload) => {
    if (!payload.voucherCode) {
        return 'Vui lòng nhập mã voucher.';
    }

    if (!ALLOWED_DISCOUNT_TYPES.has(payload.discountType)) {
        return 'Loại giảm giá không hợp lệ.';
    }

    if (payload.discountValue === undefined || payload.discountValue === null || payload.discountValue < 0) {
        return 'Giá trị giảm không hợp lệ.';
    }

    if (payload.discountType === 'PERCENT' && payload.discountValue > 100) {
        return 'Giảm theo phần trăm không được vượt quá 100%.';
    }

    if (!payload.startDate) {
        return 'Ngày bắt đầu không hợp lệ.';
    }

    if (!payload.expiredDate) {
        return 'Ngày kết thúc không hợp lệ.';
    }

    if (payload.startDate > payload.expiredDate) {
        return 'Ngày bắt đầu không được lớn hơn ngày kết thúc.';
    }

    if (payload.minOrderValue === undefined || payload.minOrderValue < 0) {
        return 'Giá trị đơn tối thiểu không hợp lệ.';
    }

    if (payload.maxDiscountValue !== null && payload.maxDiscountValue !== undefined && payload.maxDiscountValue < 0) {
        return 'Giảm tối đa không hợp lệ.';
    }

    if (payload.usageLimit === undefined || payload.usageLimit < 0) {
        return 'Số lượt dùng tối đa không hợp lệ.';
    }

    if (payload.usedCount === undefined || payload.usedCount < 0) {
        return 'Số lượt đã dùng không hợp lệ.';
    }

    if (payload.usedCount > payload.usageLimit) {
        return 'Số lượt đã dùng không được lớn hơn giới hạn.';
    }

    if (payload.usagePerCustomer === undefined || payload.usagePerCustomer < 0) {
        return 'Giới hạn mỗi khách không hợp lệ.';
    }

    return null;
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
            const payload = normalizeVoucherPayload(req.body);
            const validationMessage = validateVoucherPayload(payload);

            if (validationMessage) {
                return res.status(400).json({ message: validationMessage });
            }

            const existingVoucher = await voucherModel.getByCode(payload.voucherCode);
            if (existingVoucher) {
                return res.status(409).json({ message: 'Mã voucher đã tồn tại.' });
            }

            const voucherId = await voucherModel.create(payload);
            const createdVoucher = await voucherModel.getById(voucherId);

            res.status(201).json({ success: true, data: createdVoucher, voucherId });
        } catch (error) {
            next(error);
        }
    },

    updateVoucher: async (req, res, next) => {
        try {
            const { id } = req.params;
            const existingVoucher = await voucherModel.getById(id);

            if (!existingVoucher) {
                return res.status(404).json({ message: 'Voucher not found' });
            }

            const payload = normalizeVoucherPayload(req.body, existingVoucher);
            const validationMessage = validateVoucherPayload(payload);

            if (validationMessage) {
                return res.status(400).json({ message: validationMessage });
            }

            const duplicatedVoucher = await voucherModel.getByCode(payload.voucherCode);
            if (duplicatedVoucher && Number(duplicatedVoucher.id) !== Number(id)) {
                return res.status(409).json({ message: 'Mã voucher đã tồn tại.' });
            }

            const affectedRows = await voucherModel.update(id, payload);
            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Voucher not found' });
            }

            const updatedVoucher = await voucherModel.getById(id);
            res.json({ success: true, data: updatedVoucher });
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
