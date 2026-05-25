import { CreditCard, MapPin, Receipt } from "lucide-react";

const formatCurrency = (value = 0) => `${value.toLocaleString("vi-VN")}đ`;

export default function OrderBillingSummary({
  address = {},
  payment = {},
  billing = {},
  onEditOrderInfo,
}) {
  return (
    <div className="w-full space-y-8">
      <AddressCard address={address} />
      <PaymentCard payment={payment} />
      <TotalCard billing={billing} onEditOrderInfo={onEditOrderInfo} />
    </div>
  );
}

function AddressCard({ address }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <CardTitle icon={MapPin}>Địa chỉ nhận hàng</CardTitle>
      <div className="mt-5 space-y-3 text-sm font-medium leading-relaxed text-slate-600">
        <p className="text-[20px] font-bold leading-tight tracking-[-0.01em] text-slate-950">
          {address.name}
        </p>
        <p>{address.phone}</p>
        <p>{address.fullAddress}</p>
      </div>
    </section>
  );
}

function PaymentCard({ payment }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <CardTitle icon={CreditCard}>Phương thức thanh toán</CardTitle>

      <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded bg-slate-950 text-white">
            <CreditCard className="size-5" />
          </div>
          <div>
            <p className="text-[15px] font-bold leading-snug tracking-[-0.01em] text-slate-950">
              {payment.methodName}
            </p>
            <p className="mt-1 text-[12px] font-semibold text-amber-700">
              {payment.status}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-3 border-t border-slate-100 pt-5 text-[12px] font-medium text-slate-600">
        <SummaryRow label="Mã giao dịch:" value={payment.transactionCode} strong />
        <SummaryRow label="Ngân hàng:" value={payment.bank} strong />
      </div>
    </section>
  );
}

function TotalCard({ billing, onEditOrderInfo }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-[0_18px_35px_rgba(15,23,42,0.08)]">
      <CardTitle icon={Receipt}>Tổng kết đơn hàng</CardTitle>

      <div className="mt-6 space-y-4 text-sm font-medium text-slate-600">
        <SummaryRow
          label={`Tạm tính (${billing.itemCount} sản phẩm)`}
          value={formatCurrency(billing.subtotal)}
        />
        <SummaryRow
          label={`Phí vận chuyển (${billing.shippingMethod})`}
          value="Miễn phí"
        />
        <SummaryRow
          label="Bảo hiểm phần cứng"
          value={formatCurrency(billing.insurance)}
        />
        <SummaryRow
          label={`Mã giảm giá (${billing.voucherCode})`}
          value={`-${formatCurrency(billing.discount)}`}
          valueClassName="text-orange-700"
        />
      </div>

      <div className="mt-7 border-t border-slate-100 pt-6">
        <div className="flex items-end justify-between gap-4">
          <span className="text-[15px] font-bold uppercase tracking-normal text-slate-950">
            Tổng cộng
          </span>
          <div className="text-right">
            <p className="text-[20px] font-bold leading-none tracking-[-0.01em] text-red-600">
              {formatCurrency(billing.total)}
            </p>
            <p className="mt-2 text-[12px] font-medium text-slate-500">
              (Đã bao gồm VAT 10%)
            </p>
          </div>
        </div>
      </div>

    </section>
  );
}

function CardTitle({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="size-4 text-slate-950" />
      <h3 className="m-0 text-[15px] font-bold uppercase tracking-normal leading-none text-slate-950">
        {children}
      </h3>
    </div>
  );
}

function SummaryRow({ label, value, strong = false, valueClassName = "" }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span>{label}</span>
      <span
        className={`text-right ${
          strong ? "font-bold text-slate-950" : "font-medium text-slate-700"
        } ${valueClassName}`}
      >
        {value}
      </span>
    </div>
  );
}
