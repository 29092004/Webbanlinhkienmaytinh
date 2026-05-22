import { useState, useEffect } from "react";
import { X, Plus, MapPin } from "lucide-react";

export default function AddAddressModal({
  isOpen,
  onClose,
  onSave,
  addressToEdit,
}) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "",
    district: "",
    ward: "",
    detail: "",
    type: "home", // home or office
    isDefault: false,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (addressToEdit) {
      // Split mock address or just set it
      const parts = addressToEdit.fullAddress.split(", ");
      const detail = parts[0] || "";
      const ward = parts[1] || "";
      const district = parts[2] || "";
      const city = parts[3] || "";
      
      setFormData({
        name: addressToEdit.name || "",
        phone: addressToEdit.phone || "",
        city: city || addressToEdit.city || "",
        district: district || addressToEdit.district || "",
        ward: ward || addressToEdit.ward || "",
        detail: detail || addressToEdit.detail || "",
        type: addressToEdit.type || "home",
        isDefault: addressToEdit.isDefault || false,
      });
    } else {
      setFormData({
        name: "",
        phone: "",
        city: "",
        district: "",
        ward: "",
        detail: "",
        type: "home",
        isDefault: false,
      });
    }
    setErrors({});
  }, [addressToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleTypeSelect = (type) => {
    setFormData((prev) => ({ ...prev, type }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Vui lòng nhập họ và tên";
    if (!formData.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^[0-9+ ]{9,15}$/.test(formData.phone.trim())) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }
    if (!formData.city.trim()) newErrors.city = "Vui lòng chọn Tỉnh/Thành Phố";
    if (!formData.district.trim()) newErrors.district = "Vui lòng chọn Quận/Huyện";
    if (!formData.detail.trim()) newErrors.detail = "Vui lòng nhập địa chỉ cụ thể";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Construct fullAddress
    const fullAddress = [
      formData.detail.trim(),
      formData.ward.trim(),
      formData.district.trim(),
      formData.city.trim(),
    ]
      .filter(Boolean)
      .join(", ");

    onSave({
      id: addressToEdit?.id || Date.now(),
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      fullAddress,
      detail: formData.detail.trim(),
      ward: formData.ward.trim(),
      district: formData.district.trim(),
      city: formData.city.trim(),
      type: formData.type,
      isDefault: formData.isDefault,
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-extrabold text-gray-900 text-base">
            {addressToEdit ? "Cập nhật địa chỉ" : "Địa chỉ mới"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Row 1: Name and Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Họ và tên"
                className={`w-full bg-white border rounded-lg py-2.5 px-3 text-xs md:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                  errors.name ? "border-red-500 focus:ring-red-500/20" : "border-slate-200"
                }`}
              />
              {errors.name && <p className="text-[10px] text-red-500 font-semibold">{errors.name}</p>}
            </div>

            <div className="space-y-1">
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Số điện thoại"
                className={`w-full bg-white border rounded-lg py-2.5 px-3 text-xs md:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                  errors.phone ? "border-red-500 focus:ring-red-500/20" : "border-slate-200"
                }`}
              />
              {errors.phone && <p className="text-[10px] text-red-500 font-semibold">{errors.phone}</p>}
            </div>
          </div>

          {/* Row 2: City / District / Ward (Mock selection) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Tỉnh/Thành Phố"
                className={`w-full bg-white border rounded-lg py-2.5 px-3 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                  errors.city ? "border-red-500" : "border-slate-200"
                }`}
              />
              {errors.city && <p className="text-[10px] text-red-500 font-semibold">{errors.city}</p>}
            </div>

            <div className="space-y-1">
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                placeholder="Quận/Huyện"
                className={`w-full bg-white border rounded-lg py-2.5 px-3 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                  errors.district ? "border-red-500" : "border-slate-200"
                }`}
              />
              {errors.district && (
                <p className="text-[10px] text-red-500 font-semibold">{errors.district}</p>
              )}
            </div>

            <div className="space-y-1">
              <input
                type="text"
                name="ward"
                value={formData.ward}
                onChange={handleChange}
                placeholder="Phường/Xã (tùy chọn)"
                className="w-full bg-white border border-slate-200 rounded-lg py-2.5 px-3 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Row 3: Specific address */}
          <div className="space-y-1">
            <textarea
              name="detail"
              value={formData.detail}
              onChange={handleChange}
              placeholder="Địa chỉ cụ thể (Số nhà, tên đường, tòa nhà...)"
              rows={2}
              className={`w-full bg-white border rounded-lg py-2.5 px-3 text-xs md:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                errors.detail ? "border-red-500" : "border-slate-200"
              }`}
            />
            {errors.detail && <p className="text-[10px] text-red-500 font-semibold">{errors.detail}</p>}
          </div>

          {/* Mock Map Section */}
          <div className="relative rounded-lg h-36 bg-slate-50 border border-slate-100 flex flex-col items-center justify-center overflow-hidden">
            {/* Map styling helper */}
            <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
            
            <MapPin className="size-7 text-red-500 animate-bounce relative z-10" />
            <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wide mt-2 relative z-10">
              Vị trí trên bản đồ
            </span>
            <button
              type="button"
              className="mt-2 relative z-10 border border-slate-200 bg-white hover:bg-slate-50 text-[10px] font-bold text-gray-600 px-3 py-1.5 rounded-md flex items-center gap-1 transition"
            >
              <Plus className="size-3" />
              Thêm vị trí
            </button>
          </div>

          {/* Address Type Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide">
              Loại địa chỉ:
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleTypeSelect("home")}
                className={`flex-1 py-2 px-4 rounded-lg border text-xs font-bold transition ${
                  formData.type === "home"
                    ? "border-orange-500 text-orange-500 bg-orange-50/5"
                    : "border-slate-200 text-gray-500 hover:bg-slate-50"
                }`}
              >
                Nhà Riêng
              </button>
              <button
                type="button"
                onClick={() => handleTypeSelect("office")}
                className={`flex-1 py-2 px-4 rounded-lg border text-xs font-bold transition ${
                  formData.type === "office"
                    ? "border-orange-500 text-orange-500 bg-orange-50/5"
                    : "border-slate-200 text-gray-500 hover:bg-slate-50"
                }`}
              >
                Văn Phòng
              </button>
            </div>
          </div>

          {/* Default address checkbox */}
          <label className="flex items-center gap-2.5 cursor-pointer pt-2 select-none">
            <input
              type="checkbox"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleChange}
              disabled={addressToEdit?.isDefault}
              className="sr-only peer"
            />
            <div className="size-4.5 bg-white border border-slate-300 rounded transition peer-checked:bg-blue-600 peer-checked:border-blue-600 flex items-center justify-center peer-disabled:opacity-50">
              <div className="size-1.5 rounded-sm bg-white" />
            </div>
            <span className={`text-xs font-semibold ${addressToEdit?.isDefault ? "text-gray-400 cursor-not-allowed" : "text-gray-600"}`}>
              Đặt làm địa chỉ mặc định
            </span>
          </label>

          {/* Buttons Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-slate-200 text-xs font-bold text-gray-600 hover:bg-slate-50 transition uppercase"
            >
              Trở Lại
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-[#f05330] hover:bg-[#d64120] text-white text-xs font-extrabold transition shadow-sm uppercase"
            >
              Hoàn thành
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
