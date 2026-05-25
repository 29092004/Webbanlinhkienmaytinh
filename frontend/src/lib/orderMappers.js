import { resolveAssetUrl } from "@/components/admin/product/productUtils";

const ORDER_STATUS_LABELS = {
  PENDING: "Chờ xử lý",
  PROCESSING: "Đang xử lý",
  SHIPPING: "Đang giao",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
};

const PAYMENT_METHOD_LABELS = {
  COD: "Thanh toán khi nhận hàng (COD)",
  BANKING: "Chuyển khoản ngân hàng",
  MOMO: "Ví MoMo",
  VNPAY: "Cổng thanh toán VNPay",
};

const formatDate = (value, options) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("vi-VN", options).format(date);
};

export const formatOrderCode = (id) => `#EXO-${String(id || "").padStart(5, "0")}`;

export const getOrderStatusLabel = (status) =>
  ORDER_STATUS_LABELS[String(status || "").toUpperCase()] || "Chờ xử lý";

export const mapOrdersForHistory = (orders = [], accountId) =>
  orders
    .filter((order) => Number(order.account_id) === Number(accountId))
    .sort((left, right) => new Date(right.created_at || 0) - new Date(left.created_at || 0))
    .map((order) => ({
      id: order.id,
      code: formatOrderCode(order.id),
      date: formatDate(order.created_at, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      status: getOrderStatusLabel(order.status),
      total: Number(order.total_price || order.totalPrice || 0),
      items: (order.details || [])
        .map((detail) => detail.product_name || `Sản phẩm #${detail.product_id}`)
        .join(", "),
    }));

const buildTrackingSteps = (order) => {
  const status = String(order?.status || "").toUpperCase();
  const createdAt = order?.created_at;
  const orderedTime = formatDate(createdAt, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const estimatedDelivery = createdAt
    ? new Date(new Date(createdAt).getTime() + 2 * 24 * 60 * 60 * 1000)
    : null;

  return [
    {
      id: "ordered",
      title: "Đặt hàng",
      time: orderedTime || "-",
      status: "completed",
    },
    {
      id: "paid",
      title: "Thanh toán",
      time: orderedTime || "-",
      status: status === "PENDING" ? "active" : "completed",
    },
    {
      id: "shipping",
      title: "Đang giao",
      time: estimatedDelivery
        ? `Dự kiến: ${formatDate(estimatedDelivery, { day: "2-digit", month: "2-digit", year: "numeric" })}`
        : "-",
      status:
        status === "SHIPPING"
          ? "active"
          : status === "COMPLETED"
            ? "completed"
            : "pending",
      actionLabel: status === "SHIPPING" ? "Theo dõi giao hàng" : null,
    },
    {
      id: "done",
      title: "Hoàn thành",
      time: status === "COMPLETED" ? orderedTime || "-" : "-",
      status: status === "COMPLETED" ? "completed" : "pending",
    },
  ];
};

const buildTimeline = (order) => {
  const statusLabel = getOrderStatusLabel(order?.status);
  const orderedAt = formatDate(order?.created_at, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const steps = [
    {
      id: "created",
      status: "Đơn hàng đã được tạo",
      description: "Hệ thống đã tiếp nhận đơn hàng của bạn.",
      time: orderedAt || "-",
    },
  ];

  if (statusLabel !== "Chờ xử lý") {
    steps.unshift({
      id: "status",
      status: statusLabel,
      description: `Đơn hàng hiện đang ở trạng thái: ${statusLabel}.`,
      time: orderedAt || "-",
    });
  }

  return steps;
};

export const mapOrderDetailForView = (order, products = []) => {
  if (!order) {
    return null;
  }

  const matchedProducts = new Map(products.map((product) => [Number(product.id), product]));
  const detailItems = Array.isArray(order.details) ? order.details : [];
  const subtotal = detailItems.reduce(
    (sum, detail) => sum + Number(detail.subtotal_price || 0),
    0
  );
  const total = Number(order.total_price || order.totalPrice || subtotal || 0);
  const customerName = [order.customer_first_name, order.customer_last_name].filter(Boolean).join(" ").trim();

  return {
    code: formatOrderCode(order.id),
    orderedAt: formatDate(order.created_at, {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    items: detailItems.map((detail, index) => {
      const product = matchedProducts.get(Number(detail.product_id));

      return {
        id: `${order.id}-${detail.product_id}-${index}`,
        name: detail.product_name || product?.name || `Sản phẩm #${detail.product_id}`,
        sku: `SP-${String(detail.product_id || index + 1).padStart(4, "0")}`,
        price: Number(detail.subtotal_price || 0) / Math.max(Number(detail.quantity || 1), 1),
        quantity: Number(detail.quantity || 1),
        badge: detail.note || (product?.warranty ? `Bảo hành ${product.warranty} tháng` : ""),
        image: resolveAssetUrl(product?.images?.[0]?.url),
      };
    }),
    trackingSteps: buildTrackingSteps(order),
    timeline: buildTimeline(order),
    address: {
      name: customerName || order.account_username || "Khách hàng",
      phone: order.customer_phone || "Chưa cập nhật",
      fullAddress: order.customer_address || "Chưa cập nhật địa chỉ",
    },
    payment: {
      methodName:
        PAYMENT_METHOD_LABELS[String(order.payment_method || "").toUpperCase()] ||
        order.payment_method ||
        "Chưa cập nhật",
      status:
        String(order.status || "").toUpperCase() === "CANCELLED"
          ? "Đơn hàng đã hủy"
          : "Đã ghi nhận thanh toán",
      transactionCode: `ORD-${order.id}`,
      bank: order.payment_method === "VNPAY" ? "VNPay" : "Không áp dụng",
    },
    billing: {
      itemCount: detailItems.reduce((sum, detail) => sum + Number(detail.quantity || 0), 0),
      subtotal,
      shippingMethod: "Tiêu chuẩn",
      insurance: 0,
      voucherCode: order.voucher_code || "Không có",
      discount: 0,
      total,
    },
  };
};

export const mapOrderConfirmationForView = (order, products = []) => {
  const detailView = mapOrderDetailForView(order, products);

  if (!detailView) {
    return null;
  }

  const createdAtDate = order?.created_at ? new Date(order.created_at) : null;
  const estimatedDate = createdAtDate && !Number.isNaN(createdAtDate.getTime())
    ? new Date(createdAtDate.getTime() + 2 * 24 * 60 * 60 * 1000)
    : null;

  return {
    orderId: order?.id ?? null,
    orderCode: detailView.code,
    paymentStatus:
      String(order?.status || "").toUpperCase() === "CANCELLED"
        ? "Đã hủy"
        : "Đã ghi nhận",
    paymentMethodBadge:
      PAYMENT_METHOD_LABELS[String(order?.payment_method || "").toUpperCase()] ||
      order?.payment_method ||
      "Thanh toán",
    deliveryEstimate: estimatedDate
      ? formatDate(estimatedDate, { day: "2-digit", month: "long", year: "numeric" })
      : "Đang cập nhật",
    shippingMethod: "Giao hàng tiêu chuẩn",
    items: detailView.items,
    subtotal: detailView.billing.subtotal,
    shippingCost: 0,
    total: detailView.billing.total,
  };
};
