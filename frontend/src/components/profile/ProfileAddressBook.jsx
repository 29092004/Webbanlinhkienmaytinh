import { Home, MapPin, Save } from "lucide-react";

export default function ProfileAddressBook({ addresses, onAddressChange }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    alert("Địa chỉ đã được cập nhật ở giao diện.");
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-center gap-3">
        <MapPin className="size-6 text-blue-700" />
        <div>
          <h2 className="m-0 text-2xl font-black text-slate-950">
            Địa chỉ nhận hàng
          </h2>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Chỉnh sửa địa chỉ mặc định và thông tin người nhận.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-7 space-y-5">
        {addresses.map((address) => (
          <article
            key={address.id}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
          >
            <div className="mb-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Home className="size-5 text-blue-700" />
                <h3 className="m-0 text-lg font-black text-slate-950">
                  {address.label}
                </h3>
              </div>
              {address.isDefault ? (
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
                  Mặc định
                </span>
              ) : null}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <AddressInput
                label="Người nhận"
                value={address.receiver}
                onChange={(value) =>
                  onAddressChange(address.id, "receiver", value)
                }
              />
              <AddressInput
                label="Số điện thoại"
                value={address.phone}
                onChange={(value) => onAddressChange(address.id, "phone", value)}
              />
              <label className="block md:col-span-2">
                <span className="text-sm font-black text-slate-700">
                  Địa chỉ
                </span>
                <textarea
                  value={address.address}
                  onChange={(event) =>
                    onAddressChange(address.id, "address", event.target.value)
                  }
                  rows={3}
                  className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-950 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                />
              </label>
            </div>
          </article>
        ))}

        <button
          type="submit"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 text-sm font-black text-white transition hover:bg-blue-800"
        >
          <Save className="size-4" />
          Lưu địa chỉ
        </button>
      </form>
    </section>
  );
}

function AddressInput({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="text-sm font-black text-slate-700">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-950 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}
