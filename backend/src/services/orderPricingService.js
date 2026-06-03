import db from '../config/mysql.js';
import voucherModel from '../models/voucherModel.js';

const PRODUCT_SELECT = `
    SELECT
        p.id,
        p.name,
        p.quantity,
        p.retail_price,
        p.sale_id,
        se.sale_type,
        se.sale_value,
        se.start_date,
        se.end_date,
        se.is_active AS sale_is_active
    FROM product p
    LEFT JOIN sale_event se ON se.sale_id = p.sale_id
    WHERE p.id IN (?)
`;

const toFiniteNumber = (value, fallback = 0) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
};

const toPositiveInteger = (value) => {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

const toMysqlDateTime = (value = new Date()) => {
    const date = new Date(value);
    return date.toISOString().slice(0, 19).replace('T', ' ');
};

const normalizeOrderString = (value) => String(value ?? '').trim();

const normalizeOrderDetails = (value) => {
    if (Array.isArray(value)) {
        return value;
    }

    if (typeof value === 'string' && value.trim()) {
        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }

    return [];
};

const isSaleCurrentlyActive = (product, referenceDate = new Date()) => {
    if (!product?.sale_id || !Number(product.sale_is_active)) {
        return false;
    }

    const startDate = product.start_date ? new Date(product.start_date) : null;
    const endDate = product.end_date ? new Date(product.end_date) : null;

    if (startDate && startDate > referenceDate) {
        return false;
    }

    if (endDate && endDate < referenceDate) {
        return false;
    }

    return true;
};

const calculateProductPricing = (product, referenceDate = new Date()) => {
    const basePrice = Math.max(0, toFiniteNumber(product?.retail_price, 0));
    const saleValue = Math.max(0, toFiniteNumber(product?.sale_value, 0));

    if (!isSaleCurrentlyActive(product, referenceDate) || basePrice <= 0 || saleValue <= 0) {
        return {
            basePrice,
            finalPrice: basePrice,
            discountAmount: 0,
        };
    }

    const discountAmount = product.sale_type === 'fixed'
        ? saleValue
        : Math.round((basePrice * saleValue) / 100);

    return {
        basePrice,
        finalPrice: Math.max(basePrice - discountAmount, 0),
        discountAmount: Math.min(discountAmount, basePrice),
    };
};

const validateVoucherForOrder = async ({ voucherId, accountId, orderAmount }) => {
    if (!voucherId) {
        return {
            voucher: null,
            discountAmount: 0,
        };
    }

    const voucher = await voucherModel.getById(voucherId);
    if (!voucher) {
        const error = new Error('Voucher không tồn tại.');
        error.status = 404;
        throw error;
    }

    const now = new Date();
    const startDate = voucher.startDate ? new Date(voucher.startDate) : null;
    const expiredDate = voucher.expiredDate ? new Date(voucher.expiredDate) : null;

    if (!Number(voucher.isActive)) {
        const error = new Error('Voucher hiện không khả dụng.');
        error.status = 400;
        throw error;
    }

    if (startDate && startDate > now) {
        const error = new Error('Voucher chưa đến thời gian áp dụng.');
        error.status = 400;
        throw error;
    }

    if (expiredDate && expiredDate < now) {
        const error = new Error('Voucher đã hết hạn.');
        error.status = 400;
        throw error;
    }

    if (orderAmount < toFiniteNumber(voucher.minOrderValue, 0)) {
        const error = new Error('Đơn hàng chưa đạt giá trị tối thiểu để áp dụng voucher.');
        error.status = 400;
        throw error;
    }

    const usageLimit = toFiniteNumber(voucher.usageLimit, 0);
    const usedCount = toFiniteNumber(voucher.usedCount, 0);
    if (usageLimit > 0 && usedCount >= usageLimit) {
        const error = new Error('Voucher đã hết lượt sử dụng.');
        error.status = 409;
        throw error;
    }

    const usagePerCustomer = toFiniteNumber(voucher.usagePerCustomer, 0);
    if (usagePerCustomer > 0) {
        const [rows] = await db.query(
            'SELECT COUNT(*) AS total FROM `order` WHERE account_id = ? AND voucher_id = ?',
            [accountId, voucher.id]
        );
        const usedByCustomer = Number(rows[0]?.total || 0);

        if (usedByCustomer >= usagePerCustomer) {
            const error = new Error('Bạn đã sử dụng hết lượt áp dụng cho voucher này.');
            error.status = 409;
            throw error;
        }
    }

    const discountType = String(voucher.discountType ?? voucher.discount_type ?? '').trim().toUpperCase();
    const discountValue = toFiniteNumber(voucher.discountValue ?? voucher.discount_value, 0);
    const maxDiscountValueRaw = voucher.maxDiscountValue ?? voucher.max_discount_value;
    const maxDiscountValue = maxDiscountValueRaw === null || maxDiscountValueRaw === undefined
        ? null
        : toFiniteNumber(maxDiscountValueRaw, 0);

    const rawDiscount = discountType === 'FIXED'
        ? discountValue
        : Math.round((orderAmount * discountValue) / 100);

    const cappedDiscount = maxDiscountValue === null
        ? rawDiscount
        : Math.min(rawDiscount, maxDiscountValue);

    return {
        voucher,
        discountAmount: Math.max(0, Math.min(orderAmount, cappedDiscount)),
    };
};

const normalizeCustomerNames = (fullName, fallbackFirstName = '', fallbackLastName = '') => {
    const trimmedFullName = normalizeOrderString(fullName);

    if (!trimmedFullName) {
        return {
            customerFirstName: normalizeOrderString(fallbackFirstName),
            customerLastName: normalizeOrderString(fallbackLastName),
        };
    }

    const parts = trimmedFullName.split(/\s+/).filter(Boolean);
    if (parts.length === 1) {
        return {
            customerFirstName: parts[0],
            customerLastName: '',
        };
    }

    return {
        customerFirstName: parts.slice(0, -1).join(' '),
        customerLastName: parts.slice(-1).join(' '),
    };
};

const buildSecureOrderPayload = async ({ body = {}, authenticatedUser, allowPrivilegedAccountOverride = false }) => {
    if (!authenticatedUser?.id) {
        const error = new Error('Unauthorized');
        error.status = 401;
        throw error;
    }

    const requestedPaymentMethod = normalizeOrderString(body.paymentMethod ?? body.payment_method).toUpperCase();
    const paymentMethod = requestedPaymentMethod || 'COD';
    const requestedAccountId = toPositiveInteger(body.accountId ?? body.account_id);
    const isPrivilegedUser = ['admin', 'staff'].includes(authenticatedUser.role);
    const accountId = isPrivilegedUser && allowPrivilegedAccountOverride
        ? requestedAccountId || Number(authenticatedUser.id)
        : Number(authenticatedUser.id);

    if (!Number.isInteger(accountId) || accountId <= 0) {
        const error = new Error('Tài khoản đặt hàng không hợp lệ.');
        error.status = 400;
        throw error;
    }

    if (!isPrivilegedUser && requestedAccountId && requestedAccountId !== accountId) {
        const error = new Error('Bạn không thể tạo đơn hàng cho tài khoản khác.');
        error.status = 403;
        throw error;
    }

    const detailsInput = normalizeOrderDetails(body.details);
    if (!Array.isArray(detailsInput) || detailsInput.length === 0) {
        const error = new Error('Đơn hàng phải có ít nhất một sản phẩm.');
        error.status = 400;
        throw error;
    }

    const requestedDetails = detailsInput.map((detail) => {
        const productId = toPositiveInteger(detail.productId ?? detail.product_id);
        const quantity = toPositiveInteger(detail.quantity);

        if (!productId || !quantity) {
            const error = new Error('Chi tiết đơn hàng không hợp lệ.');
            error.status = 400;
            throw error;
        }

        return {
            productId,
            quantity,
            note: normalizeOrderString(detail.note ?? ''),
        };
    });

    const productIds = [...new Set(requestedDetails.map((detail) => detail.productId))];
    const [products] = await db.query(PRODUCT_SELECT, [productIds]);
    const productsById = new Map(products.map((product) => [Number(product.id), product]));

    const normalizedDetails = requestedDetails.map((detail) => {
        const product = productsById.get(detail.productId);
        if (!product) {
            const error = new Error(`Sản phẩm #${detail.productId} không tồn tại.`);
            error.status = 404;
            throw error;
        }

        const pricing = calculateProductPricing(product);
        return {
            productId: detail.productId,
            quantity: detail.quantity,
            note: detail.note || null,
            unitPrice: pricing.finalPrice,
            subtotalPrice: pricing.finalPrice * detail.quantity,
            productName: product.name,
        };
    });

    const totalPrice = normalizedDetails.reduce((sum, detail) => sum + detail.subtotalPrice, 0);
    const voucherId = toPositiveInteger(body.voucherId ?? body.voucher_id);
    const { voucher, discountAmount } = await validateVoucherForOrder({
        voucherId,
        accountId,
        orderAmount: totalPrice,
    });

    const fullName = normalizeOrderString(body.fullName ?? body.customerFullName ?? body.customer_full_name);
    const normalizedNames = normalizeCustomerNames(
        fullName,
        body.customerFirstName ?? body.customer_first_name,
        body.customerLastName ?? body.customer_last_name
    );
    const customerAddress = normalizeOrderString(body.customerAddress ?? body.customer_address);
    const customerEmail = normalizeOrderString(body.customerEmail ?? body.customer_email);
    const customerPhone = normalizeOrderString(body.customerPhone ?? body.customer_phone);
    const deliveryMethod = normalizeOrderString(body.deliveryMethod ?? body.delivery_method) || 'Standard';

    if (!customerAddress || !customerPhone || !normalizedNames.customerFirstName) {
        const error = new Error('Thông tin nhận hàng chưa đầy đủ.');
        error.status = 400;
        throw error;
    }

    return {
        createdAt: toMysqlDateTime(),
        paymentMethod,
        status: 'PENDING',
        accountId,
        voucherId: voucher?.id ?? null,
        totalPrice,
        discountAmount,
        finalPrice: Math.max(0, totalPrice - discountAmount),
        customerAddress,
        customerEmail,
        customerPhone,
        customerFirstName: normalizedNames.customerFirstName || 'Khách hàng',
        customerLastName: normalizedNames.customerLastName,
        deliveryMethod,
        details: normalizedDetails.map((detail) => ({
            productId: detail.productId,
            quantity: detail.quantity,
            subtotalPrice: detail.subtotalPrice,
            note: detail.note,
        })),
    };
};

export {
    buildSecureOrderPayload,
    calculateProductPricing,
    isSaleCurrentlyActive,
    toMysqlDateTime,
};
