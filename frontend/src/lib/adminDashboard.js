const DAY_IN_MS = 24 * 60 * 60 * 1000;

const ORDER_ACTIVE_STATUSES = new Set(["PENDING", "PROCESSING", "SHIPPING", "COMPLETED"]);

export function formatCurrency(value) {
  return `${Number(value || 0).toLocaleString("vi-VN")}đ`;
}

export function getTodayDateInputValue() {
  const now = new Date();
  const timezoneOffset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - timezoneOffset).toISOString().slice(0, 10);
}

export function getDefaultDashboardRange() {
  const endDate = getTodayDateInputValue();
  const end = new Date(`${endDate}T00:00:00`);
  const start = new Date(end.getTime() - 29 * DAY_IN_MS);
  const startDate = new Date(start.getTime() - start.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);

  return { startDate, endDate };
}

function normalizeStatus(status) {
  return String(status || "").toUpperCase();
}

function isActiveRevenueOrder(order) {
  return ORDER_ACTIVE_STATUSES.has(normalizeStatus(order.status)) && normalizeStatus(order.status) !== "CANCELLED";
}

function isValidDate(date) {
  return date instanceof Date && !Number.isNaN(date.getTime());
}

function parseOrderDate(value) {
  if (!value) {
    return null;
  }

  const parsedDate = new Date(value);
  return isValidDate(parsedDate) ? parsedDate : null;
}

function parseCustomerDate(customer) {
  const candidate = customer.created_at || customer.createdAt || customer.updated_at || customer.updatedAt;
  if (!candidate) {
    return null;
  }

  const parsedDate = new Date(candidate);
  return isValidDate(parsedDate) ? parsedDate : null;
}

function toInputDate(date) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

function buildDateKey(date) {
  return date.toISOString().slice(0, 10);
}

function calculateTrend(currentValue, previousValue) {
  if (previousValue === 0) {
    if (currentValue === 0) {
      return { value: "0%", type: "neutral" };
    }

    return { value: "100%", type: "up" };
  }

  const change = ((currentValue - previousValue) / Math.abs(previousValue)) * 100;
  const normalized = Number.isFinite(change) ? change : 0;

  if (normalized === 0) {
    return { value: "0%", type: "neutral" };
  }

  return {
    value: `${Math.abs(normalized).toFixed(1)}%`,
    type: normalized > 0 ? "up" : "down",
  };
}

function buildRangeMeta(startDate, endDate) {
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T23:59:59`);
  const diffInMs = end.getTime() - start.getTime();
  const days = Math.max(1, Math.floor(diffInMs / DAY_IN_MS) + 1);

  const previousEnd = new Date(start.getTime() - DAY_IN_MS);
  const previousStart = new Date(previousEnd.getTime() - (days - 1) * DAY_IN_MS);

  return {
    start,
    end,
    days,
    previousStart,
    previousEnd,
  };
}

function isWithinRange(date, start, end) {
  return Boolean(date) && date.getTime() >= start.getTime() && date.getTime() <= end.getTime();
}

function sumOrderRevenue(orders) {
  return orders.reduce((total, order) => total + Number(order.total_price || order.totalPrice || 0), 0);
}

function getPreviousPeriodOrders(orders, previousStart, previousEnd) {
  return orders.filter((order) => {
    const orderDate = parseOrderDate(order.created_at || order.createdAt);
    return isActiveRevenueOrder(order) && isWithinRange(orderDate, previousStart, previousEnd);
  });
}

function getPreviousPeriodCustomers(customers, previousStart, previousEnd) {
  return customers.filter((customer) => {
    const customerDate = parseCustomerDate(customer);
    return isWithinRange(customerDate, previousStart, previousEnd);
  });
}

export function clampDashboardRange(startDate, endDate) {
  const fallback = getDefaultDashboardRange();
  let nextStartDate = startDate || fallback.startDate;
  let nextEndDate = endDate || fallback.endDate;

  if (nextStartDate < fallback.startDate) {
    nextStartDate = fallback.startDate;
  }

  if (nextEndDate > fallback.endDate) {
    nextEndDate = fallback.endDate;
  }

  if (nextStartDate > nextEndDate) {
    nextStartDate = nextEndDate;
  }

  const start = new Date(`${nextStartDate}T00:00:00`);
  const end = new Date(`${nextEndDate}T00:00:00`);
  const diffInDays = Math.floor((end.getTime() - start.getTime()) / DAY_IN_MS);

  if (diffInDays > 30) {
    const adjustedStart = new Date(end.getTime() - 30 * DAY_IN_MS);
    nextStartDate = toInputDate(adjustedStart);
  }

  return {
    startDate: nextStartDate,
    endDate: nextEndDate,
  };
}

export function buildDashboardMetrics({ orders = [], products = [], customers = [], startDate, endDate }) {
  const { start, end, days, previousStart, previousEnd } = buildRangeMeta(startDate, endDate);

  const rangeOrders = orders.filter((order) => {
    const orderDate = parseOrderDate(order.created_at || order.createdAt);
    return isWithinRange(orderDate, start, end);
  });
  const activeRangeOrders = rangeOrders.filter(isActiveRevenueOrder);
  const previousActiveOrders = getPreviousPeriodOrders(orders, previousStart, previousEnd);

  const rangeCustomers = customers.filter((customer) => {
    const customerDate = parseCustomerDate(customer);
    return isWithinRange(customerDate, start, end);
  });
  const previousRangeCustomers = getPreviousPeriodCustomers(customers, previousStart, previousEnd);

  const revenueCurrent = sumOrderRevenue(activeRangeOrders);
  const revenuePrevious = sumOrderRevenue(previousActiveOrders);
  const orderCountCurrent = activeRangeOrders.length;
  const orderCountPrevious = previousActiveOrders.length;
  const totalProductStock = products.reduce((total, product) => total + Number(product.quantity || 0), 0);
  const outOfStockCount = products.filter((product) => Number(product.quantity || 0) <= 0).length;
  const lowStockCount = products.filter((product) => Number(product.quantity || 0) > 0 && Number(product.quantity || 0) <= 5).length;
  const customerCurrent = rangeCustomers.length;
  const customerPrevious = previousRangeCustomers.length;
  const hasCustomerCreatedAt = customers.some((customer) => Boolean(parseCustomerDate(customer)));

  const dailyRevenueMap = new Map();
  for (let index = 0; index < days; index += 1) {
    const date = new Date(start.getTime() + index * DAY_IN_MS);
    dailyRevenueMap.set(buildDateKey(date), {
      dateKey: buildDateKey(date),
      label: `${date.getDate()}/${date.getMonth() + 1}`,
      value: 0,
    });
  }

  activeRangeOrders.forEach((order) => {
    const orderDate = parseOrderDate(order.created_at || order.createdAt);
    const dateKey = orderDate ? buildDateKey(orderDate) : null;

    if (dateKey && dailyRevenueMap.has(dateKey)) {
      dailyRevenueMap.get(dateKey).value += Number(order.total_price || order.totalPrice || 0);
    }
  });

  const categoryBuckets = products.reduce((accumulator, product) => {
    const key = product.category_name || "Khác";
    const quantity = Number(product.quantity || 0);
    const current = accumulator.get(key) || { label: key, count: 0 };
    current.count += quantity;
    accumulator.set(key, current);
    return accumulator;
  }, new Map());

  const maxCategoryCount = Math.max(
    1,
    ...Array.from(categoryBuckets.values()).map((item) => item.count),
  );

  const inventoryItems = Array.from(categoryBuckets.values())
    .sort((left, right) => right.count - left.count)
    .slice(0, 4)
    .map((item, index) => {
      const percentage = Math.max(8, Math.round((item.count / maxCategoryCount) * 100));
      const palette = [
        { color: "bg-rose-500", text: "text-rose-600" },
        { color: "bg-blue-500", text: "text-blue-600" },
        { color: "bg-emerald-500", text: "text-emerald-600" },
        { color: "bg-violet-500", text: "text-violet-600" },
      ][index % 4];

      let status = "Ổn định";
      if (item.count <= 5) {
        status = "Thấp";
      } else if (item.count >= maxCategoryCount * 0.7) {
        status = "Dồi dào";
      }

      return {
        ...item,
        status,
        percentage,
        color: palette.color,
        textColor: status === "Thấp" ? "text-rose-600" : palette.text,
      };
    });

  const recentOrders = [...orders]
    .sort((left, right) => {
      const leftTime = parseOrderDate(left.created_at || left.createdAt)?.getTime() ?? 0;
      const rightTime = parseOrderDate(right.created_at || right.createdAt)?.getTime() ?? 0;
      return rightTime - leftTime;
    })
    .slice(0, 6)
    .map((order) => {
      const fullName = `${order.customer_first_name ?? ""} ${order.customer_last_name ?? ""}`.trim();
      const customerName = fullName || order.account_username || "Khách hàng";
      const initials = customerName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() || "")
        .join("");
      const status = normalizeStatus(order.status);

      return {
        id: order.id,
        orderCode: `#ORD-${order.id}`,
        customer: customerName,
        initials: initials || "KH",
        product: order.product_name || order.details?.[0]?.product_name || "Nhiều sản phẩm",
        amount: formatCurrency(order.total_price || order.totalPrice || 0),
        statusLabel: getOrderStatusLabel(status),
        statusColor: getOrderStatusClasses(status),
      };
    });

  return {
    stats: {
      revenue: {
        title: "Tổng doanh thu",
        value: formatCurrency(revenueCurrent),
        trend: calculateTrend(revenueCurrent, revenuePrevious),
      },
      orders: {
        title: "Đơn hàng hợp lệ",
        value: orderCountCurrent.toLocaleString("vi-VN"),
        trend: calculateTrend(orderCountCurrent, orderCountPrevious),
      },
      products: {
        title: "Tổng sản phẩm",
        value: products.length.toLocaleString("vi-VN"),
        trend: { value: `${outOfStockCount} hết hàng`, type: outOfStockCount > 0 ? "down" : "neutral" },
      },
      customers: {
        title: hasCustomerCreatedAt ? "Khách hàng mới" : "Tổng khách hàng",
        value: (hasCustomerCreatedAt ? customerCurrent : customers.length).toLocaleString("vi-VN"),
        trend: hasCustomerCreatedAt
          ? calculateTrend(customerCurrent, customerPrevious)
          : { value: `${customers.length} tài khoản`, type: "neutral" },
      },
    },
    revenueSeries: Array.from(dailyRevenueMap.values()),
    inventoryItems,
    reminders: {
      pendingOrders: orders.filter((order) => normalizeStatus(order.status) === "PENDING").length,
      shippingOrders: orders.filter((order) => normalizeStatus(order.status) === "SHIPPING").length,
      lowStockCount,
      outOfStockCount,
    },
    recentOrders,
  };
}

export function getOrderStatusLabel(status) {
  switch (normalizeStatus(status)) {
    case "COMPLETED":
      return "Hoàn thành";
    case "PROCESSING":
      return "Đang xử lý";
    case "SHIPPING":
      return "Đang giao";
    case "CANCELLED":
      return "Đã hủy";
    default:
      return "Chờ xử lý";
  }
}

export function getOrderStatusClasses(status) {
  switch (normalizeStatus(status)) {
    case "COMPLETED":
      return "bg-emerald-100 text-emerald-600 border-emerald-200";
    case "PROCESSING":
      return "bg-blue-100 text-blue-600 border-blue-200";
    case "SHIPPING":
      return "bg-amber-100 text-amber-600 border-amber-200";
    case "CANCELLED":
      return "bg-rose-100 text-rose-600 border-rose-200";
    default:
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
}
