import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const emailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const formatCurrency = (value) => {
    return Number(value || 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};

const getLocalProductImagePath = (url) => {
    if (!url) return null;
    
    // Extract filename
    let filename = url;
    if (url.startsWith('/uploads/products/')) {
        filename = url.replace('/uploads/products/', '');
    } else if (url.startsWith('uploads/products/')) {
        filename = url.replace('uploads/products/', '');
    } else if (url.startsWith('/uploads/')) {
        filename = url.replace('/uploads/', '');
    } else if (url.startsWith('uploads/')) {
        filename = url.replace('uploads/', '');
    }

    // Decode URL encoded characters (like %20 for spaces)
    try {
        filename = decodeURIComponent(filename);
    } catch (e) {
        // Fallback to original filename
    }
    
    // Try in uploads/products
    const pathInProducts = path.resolve(__dirname, '../../uploads/products', filename);
    if (fs.existsSync(pathInProducts)) {
        return pathInProducts;
    }
    
    // Try in uploads/
    const pathInUploads = path.resolve(__dirname, '../../uploads', filename);
    if (fs.existsSync(pathInUploads)) {
        return pathInUploads;
    }
    
    return null;
};

const formatDate = (dateString) => {
    if (!dateString) return new Date().toLocaleDateString('vi-VN');
    return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const getStatusBadgeColor = (status) => {
    switch (status?.toUpperCase()) {
        case 'COMPLETED':
            return { bg: '#d1fae5', text: '#065f46', label: 'Hoàn thành' };
        case 'CANCELLED':
            return { bg: '#fee2e2', text: '#991b1b', label: 'Đã hủy' };
        case 'SHIPPING':
            return { bg: '#dbeafe', text: '#1e40af', label: 'Đang giao hàng' };
        case 'PROCESSING':
            return { bg: '#fef3c7', text: '#92400e', label: 'Đang xử lý' };
        case 'PENDING':
        default:
            return { bg: '#f3f4f6', text: '#374151', label: 'Chờ thanh toán' };
    }
};

const getOrderStatusMessage = (status) => {
    switch (status?.toUpperCase()) {
        case 'COMPLETED':
            return 'Cảm ơn bạn đã tin tưởng mua sắm! Đơn hàng của bạn đã được giao thành công.';
        case 'CANCELLED':
            return 'Đơn hàng của bạn đã bị hủy trên hệ thống. Nếu có bất kỳ thắc mắc nào, hãy liên hệ với bộ phận hỗ trợ của chúng tôi.';
        case 'SHIPPING':
            return 'Đơn hàng của bạn đã được đóng gói và bàn giao cho đơn vị vận chuyển.';
        case 'PROCESSING':
            return 'Đơn hàng của bạn đang được cửa hàng chuẩn bị và đóng gói.';
        case 'PENDING':
        default:
            return 'Đơn hàng của bạn đã được tạo thành công và đang chờ xác thực thanh toán.';
    }
};

const buildBaseEmailTemplate = (title, headerColor, contentHtml) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f8fafc;
            margin: 0;
            padding: 0;
            color: #334155;
            -webkit-font-smoothing: antialiased;
        }
        .container {
            max-width: 650px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 16px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.02);
            overflow: hidden;
            border: 1px solid #e2e8f0;
        }
        .header {
            background: linear-gradient(135deg, ${headerColor}, #1e3a8a);
            padding: 35px 20px;
            text-align: center;
            color: #ffffff;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 700;
            letter-spacing: 0.5px;
        }
        .content {
            padding: 30px 25px;
        }
        .footer {
            background-color: #f1f5f9;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #64748b;
            border-top: 1px solid #e2e8f0;
        }
        .btn {
            display: inline-block;
            background-color: #2563eb;
            color: #ffffff !important;
            text-decoration: none;
            padding: 12px 25px;
            border-radius: 9999px;
            font-weight: 600;
            font-size: 14px;
            margin: 20px 0;
            box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th {
            background-color: #f8fafc;
            font-weight: 600;
            text-align: left;
            padding: 12px;
            border-bottom: 2px solid #e2e8f0;
            color: #475569;
            font-size: 13px;
        }
        td {
            padding: 12px;
            border-bottom: 1px solid #f1f5f9;
            vertical-align: middle;
            font-size: 14px;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .total-row td {
            font-weight: bold;
            border-bottom: none;
            font-size: 15px;
        }
        .total-highlight {
            color: #2563eb;
            font-size: 18px !important;
        }
        .badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 9999px;
            font-size: 12px;
            font-weight: 600;
        }
        .info-card {
            background-color: #f8fafc;
            border: 1px solid #f1f5f9;
            border-radius: 12px;
            padding: 15px;
            margin-bottom: 20px;
        }
        .info-card h3 {
            margin-top: 0;
            margin-bottom: 10px;
            font-size: 14px;
            color: #475569;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .info-card p {
            margin: 5px 0;
            font-size: 14px;
            line-height: 1.5;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${title}</h1>
        </div>
        <div class="content">
            ${contentHtml}
        </div>
        <div class="footer">
            <p>Email này được gửi tự động từ hệ thống Cửa hàng bán linh kiện máy tính của bạn.</p>
            <p>&copy; ${new Date().getFullYear()} Computer Store. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

export const emailService = {
    sendOrderConfirmationEmail: async (order) => {
        if (!order || !order.customer_email) {
            console.log('Không thể gửi mail xác nhận: Không tìm thấy email khách hàng.');
            return;
        }

        const attachments = [];
        const itemsHtml = (order.details || []).map((item, index) => {
            const rawImgUrl = item.productImage || item.product_image;
            const localPath = getLocalProductImagePath(rawImgUrl);
            
            let imgHtmlSrc;
            if (localPath) {
                const cidName = `product_image_${index}`;
                imgHtmlSrc = `cid:${cidName}`;
                attachments.push({
                    filename: path.basename(localPath),
                    path: localPath,
                    cid: cidName
                });
            } else {
                imgHtmlSrc = 'https://placehold.co/100x100?text=No+Image';
            }

            return `
                <tr>
                    <td width="70" class="text-center">
                        <img src="${imgHtmlSrc}" alt="${item.productName || item.product_name}" width="60" height="60" style="object-fit: cover; border-radius: 8px; border: 1px solid #e2e8f0;" />
                    </td>
                    <td>
                        <div style="font-weight: 600; color: #1e293b;">${item.productName || item.product_name}</div>
                        ${item.note ? `<div style="font-size: 12px; color: #64748b; margin-top: 3px;">Ghi chú: ${item.note}</div>` : ''}
                    </td>
                    <td class="text-center">${item.quantity}</td>
                    <td class="text-right">${formatCurrency(item.subtotalPrice / item.quantity)}</td>
                    <td class="text-right" style="font-weight: 600; color: #1e293b;">${formatCurrency(item.subtotalPrice)}</td>
                </tr>
            `;
        }).join('');

        const statusInfo = getStatusBadgeColor(order.status);

        const contentHtml = `
            <p>Chào <b>${order.customer_first_name || ''} ${order.customer_last_name || 'Khách hàng'}</b>,</p>
            <p>Cảm ơn bạn đã đặt mua hàng tại cửa hàng chúng tôi! Đơn hàng của bạn đã được ghi nhận và đang chờ xử lý.</p>
            
            <div class="info-card">
                <h3>Chi tiết đơn hàng</h3>
                <p><b>Ngày đặt hàng:</b> ${formatDate(order.createdAt || order.created_at)}</p>
                <p><b>Phương thức thanh toán:</b> ${order.paymentMethod || 'COD'}</p>
            </div>

            <div class="info-card">
                <h3>Thông tin nhận hàng</h3>
                <p><b>Người nhận:</b> ${order.customer_first_name || ''} ${order.customer_last_name || 'Khách hàng'}</p>
                <p><b>Số điện thoại:</b> ${order.customer_phone || 'N/A'}</p>
                <p><b>Địa chỉ nhận hàng:</b> ${order.customer_address || order.shipping_address || 'N/A'}</p>
            </div>

            <h3 style="margin-top: 30px; font-size: 16px; color: #1e293b;">Danh sách sản phẩm</h3>
            <table>
                <thead>
                    <tr>
                        <th class="text-center">Hình ảnh</th>
                        <th>Sản phẩm</th>
                        <th class="text-center">Số lượng</th>
                        <th class="text-right">Đơn giá</th>
                        <th class="text-right">Thành tiền</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                    <tr style="border-top: 2px solid #e2e8f0;">
                        <td colspan="3" style="border: none;"></td>
                        <td class="text-right" style="color: #64748b;">Tổng tiền hàng:</td>
                        <td class="text-right" style="color: #1e293b; font-weight: 500;">${formatCurrency(order.totalPrice || order.total_price)}</td>
                    </tr>
                    ${order.discountAmount ? `
                    <tr>
                        <td colspan="3" style="border: none;"></td>
                        <td class="text-right" style="color: #64748b;">Voucher giảm giá:</td>
                        <td class="text-right" style="color: #dc2626; font-weight: 500;">-${formatCurrency(order.discountAmount)}</td>
                    </tr>
                    ` : ''}
                    <tr class="total-row">
                        <td colspan="3" style="border: none;"></td>
                        <td class="text-right" style="border-top: 1px solid #e2e8f0; padding-top: 15px;">Tổng thanh toán:</td>
                        <td class="text-right total-highlight" style="border-top: 1px solid #e2e8f0; padding-top: 15px;">${formatCurrency(order.finalPrice || order.final_price)}</td>
                    </tr>
                </tbody>
            </table>

            <p style="margin-top: 30px; line-height: 1.6;">Chúng tôi sẽ gửi thêm email cập nhật cho bạn khi đơn hàng được vận chuyển. Chúc bạn một ngày tốt lành!</p>
        `;

        const title = 'Xác nhận đơn hàng thành công!';
        const emailHtml = buildBaseEmailTemplate(title, '#2563eb', contentHtml);

        return emailTransporter.sendMail({
            from: process.env.EMAIL_USER,
            to: order.customer_email,
            subject: '[Computer Store] Xác nhận đơn hàng thành công',
            html: emailHtml,
            attachments,
        });
    },

    sendOrderStatusUpdateEmail: async (order) => {
        if (!order || !order.customer_email) {
            console.log('Không thể gửi mail cập nhật trạng thái: Không tìm thấy email khách hàng.');
            return;
        }

        const attachments = [];
        const itemsHtml = (order.details || []).map((item, index) => {
            const rawImgUrl = item.productImage || item.product_image;
            const localPath = getLocalProductImagePath(rawImgUrl);
            
            let imgHtmlSrc;
            if (localPath) {
                const cidName = `product_image_${index}`;
                imgHtmlSrc = `cid:${cidName}`;
                attachments.push({
                    filename: path.basename(localPath),
                    path: localPath,
                    cid: cidName
                });
            } else {
                imgHtmlSrc = 'https://placehold.co/100x100?text=No+Image';
            }

            return `
                <tr>
                    <td width="50" class="text-center">
                        <img src="${imgHtmlSrc}" alt="${item.productName || item.product_name}" width="40" height="40" style="object-fit: cover; border-radius: 6px;" />
                    </td>
                    <td>
                        <span style="font-weight: 500; color: #334155;">${item.productName || item.product_name}</span> x ${item.quantity}
                    </td>
                    <td class="text-right" style="font-weight: 600; color: #334155;">${formatCurrency(item.subtotalPrice)}</td>
                </tr>
            `;
        }).join('');

        const statusInfo = getStatusBadgeColor(order.status);
        const statusMsg = getOrderStatusMessage(order.status);

        const contentHtml = `
            <p>Chào <b>${order.customer_first_name || ''} ${order.customer_last_name || 'Khách hàng'}</b>,</p>
            <p>${statusMsg}</p>
            
            <div class="info-card" style="margin-top: 25px;">
                <h3>Thông tin đơn hàng</h3>
                <p><b>Trạng thái hiện tại:</b> <span class="badge" style="background-color: ${statusInfo.bg}; color: ${statusInfo.text};">${statusInfo.label}</span></p>
                <p><b>Thời gian cập nhật:</b> ${formatDate(new Date())}</p>
                <p><b>Tổng giá trị đơn hàng:</b> <span style="font-weight: bold; color: #2563eb;">${formatCurrency(order.finalPrice || order.final_price)}</span></p>
            </div>

            <h3 style="margin-top: 25px; font-size: 15px; color: #1e293b;">Sản phẩm trong đơn hàng</h3>
            <table>
                <tbody>
                    ${itemsHtml}
                </tbody>
            </table>

            <p style="margin-top: 25px; line-height: 1.6;">Nếu cần hỗ trợ gấp về đơn hàng này, vui lòng liên hệ hotline hoặc trả lời trực tiếp email này.</p>
        `;

        const title = 'Cập nhật trạng thái đơn hàng';
        const emailHtml = buildBaseEmailTemplate(title, '#1e3a8a', contentHtml);

        return emailTransporter.sendMail({
            from: process.env.EMAIL_USER,
            to: order.customer_email,
            subject: `[Computer Store] Trạng thái đơn hàng: ${statusInfo.label}`,
            html: emailHtml,
            attachments,
        });
    },

    sendShippingNotificationEmail: async (order, shipping) => {
        if (!order || !order.customer_email) {
            console.log('Không thể gửi mail vận chuyển: Không tìm thấy email khách hàng.');
            return;
        }

        const attachments = [];
        const itemsHtml = (order.details || []).map((item, index) => {
            const rawImgUrl = item.productImage || item.product_image;
            const localPath = getLocalProductImagePath(rawImgUrl);
            
            let imgHtmlSrc;
            if (localPath) {
                const cidName = `product_image_${index}`;
                imgHtmlSrc = `cid:${cidName}`;
                attachments.push({
                    filename: path.basename(localPath),
                    path: localPath,
                    cid: cidName
                });
            } else {
                imgHtmlSrc = 'https://placehold.co/100x100?text=No+Image';
            }

            return `
                <tr>
                    <td width="50" class="text-center">
                        <img src="${imgHtmlSrc}" alt="${item.productName || item.product_name}" width="40" height="40" style="object-fit: cover; border-radius: 6px;" />
                    </td>
                    <td>
                        <span style="font-weight: 500; color: #334155;">${item.productName || item.product_name}</span> x ${item.quantity}
                    </td>
                </tr>
            `;
        }).join('');

        const contentHtml = `
            <p>Chào <b>${order.customer_first_name || ''} ${order.customer_last_name || 'Khách hàng'}</b>,</p>
            <p>Đơn hàng của bạn đã được chuẩn bị xong và đang trên đường giao tới bạn!</p>
            
            <div class="info-card">
                <h3>Thông tin giao hàng</h3>
                <p><b>Người nhận:</b> ${order.customer_first_name || ''} ${order.customer_last_name || 'Khách hàng'}</p>
                <p><b>Số điện thoại:</b> ${order.customer_phone || 'N/A'}</p>
                <p><b>Địa chỉ nhận hàng:</b> ${shipping.shippingAddress || shipping.shipping_address || order.customer_address || 'N/A'}</p>
                <p><b>Hình thức vận chuyển:</b> ${shipping.deliveryMethod || shipping.delivery_method || 'Tiêu chuẩn'}</p>
            </div>

            <h3 style="margin-top: 25px; font-size: 15px; color: #1e293b;">Sản phẩm đang được giao</h3>
            <table>
                <tbody>
                    ${itemsHtml}
                </tbody>
            </table>

            <p style="margin-top: 25px; line-height: 1.6;">Vui lòng giữ liên lạc điện thoại để shipper có thể liên hệ giao hàng cho bạn trong thời gian sớm nhất.</p>
        `;

        const title = 'Đơn hàng đang được giao!';
        const emailHtml = buildBaseEmailTemplate(title, '#0f766e', contentHtml);

        return emailTransporter.sendMail({
            from: process.env.EMAIL_USER,
            to: order.customer_email,
            subject: '[Computer Store] Đơn hàng đang được vận chuyển',
            html: emailHtml,
            attachments,
        });
    }
};
