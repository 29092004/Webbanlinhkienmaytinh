import shippingModel from '../models/shippingModel.js';
import orderModel from '../models/orderModel.js';

const syncOrderStatusWithShipping = async (orderId, shippingStatus) => {
    const order = await orderModel.getById(orderId);

    if (!order) {
        return;
    }

    let nextOrderStatus = order.status;

    switch (shippingStatus?.toUpperCase()) {
        case 'DELIVERED':
            nextOrderStatus = 'COMPLETED';
            break;
        case 'RETURNED':
            nextOrderStatus = 'CANCELLED';
            break;
        default:
            nextOrderStatus = 'SHIPPING';
            break;
    }

    await orderModel.update(
        orderId,
        {
            createdAt: order.createdAt ?? order.created_at,
            paymentMethod: order.paymentMethod ?? order.payment_method,
            status: nextOrderStatus,
            accountId: order.accountId ?? order.account_id,
            voucherId: order.voucherId ?? order.voucher_id ?? null,
            totalPrice: order.totalPrice ?? order.total_price,
            discountAmount: order.discountAmount ?? order.discount_amount ?? 0,
            finalPrice: order.finalPrice ?? order.final_price ?? order.totalPrice ?? order.total_price,
            details: order.details ?? [],
        }
    );
};

const shippingController = {
    getShippings: async (req, res) => {
        try {
            const rows = await shippingModel.getAll();
            res.json({ success: true, data: rows });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    getShippingById: async (req, res) => {
        try {
            const { id } = req.params;
            const row = await shippingModel.getById(id);
            if (!row) {
                return res.status(404).json({ message: 'Shipping not found' });
            }
            res.json({ success: true, data: row });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    createShipping: async (req, res, next) => {
        try {
            const { date, status } = req.body;
            const deliveryMethod = req.body.deliveryMethod ?? req.body.delivery_method;
            const orderId = req.body.orderId ?? req.body.order_id ?? req.body.id_order;
            const shippingAddress = req.body.shippingAddress ?? req.body.shipping_address;

            if (!date || !deliveryMethod || !status || !orderId || !shippingAddress) {
                return res.status(400).json({ message: 'Invalid input' });
            }

            const existingShipping = await shippingModel.getByOrderId(orderId);
            if (existingShipping) {
                return res.status(400).json({ message: 'Đơn hàng này đã có vận đơn.' });
            }

            const shippingId = await shippingModel.create(date, deliveryMethod, status, orderId, shippingAddress);
            await syncOrderStatusWithShipping(orderId, status);
            res.status(201).json({ success: true, shippingId });
        } catch (error) {
            next(error);
        }
    },

    updateShipping: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { date, status } = req.body;
            const deliveryMethod = req.body.deliveryMethod ?? req.body.delivery_method;
            const orderId = req.body.orderId ?? req.body.order_id ?? req.body.id_order;
            const shippingAddress = req.body.shippingAddress ?? req.body.shipping_address;

            if (!date || !deliveryMethod || !status || !orderId || !shippingAddress) {
                return res.status(400).json({ message: 'Invalid input' });
            }

            const affectedRows = await shippingModel.update(id, date, deliveryMethod, status, orderId, shippingAddress);
            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Shipping not found' });
            }
            await syncOrderStatusWithShipping(orderId, status);
            res.json({ success: true });
        } catch (error) {
            next(error);
        }
    },

    deleteShipping: async (req, res) => {
        try {
            const { id } = req.params;
            const affectedRows = await shippingModel.delete(id);
            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Shipping not found' });
            }
            res.json({ success: true });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },
};

export default shippingController;
