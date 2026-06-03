import { useCallback, useEffect, useState } from "react";

export default function CheckoutForm({
  formData,
  onFormChange,
}) {
  const [citiesList, setCitiesList] = useState([]);
  const [districtsList, setDistrictsList] = useState([]);
  const [wardsList, setWardsList] = useState([]);

  const [selectedCityCode, setSelectedCityCode] = useState("");
  const [selectedDistrictCode, setSelectedDistrictCode] = useState("");
  const hasSelectedCity = Boolean(selectedCityCode);
  const hasSelectedDistrict = hasSelectedCity && Boolean(selectedDistrictCode);

  const updateCity = useCallback((name, code) => {
    setSelectedCityCode(code);
    onFormChange({ target: { name: "city", value: name } });
  }, [onFormChange]);

  const updateDistrict = useCallback((name, code) => {
    setSelectedDistrictCode(code);
    onFormChange({ target: { name: "district", value: name } });
  }, [onFormChange]);

  const updateWard = useCallback((name) => {
    onFormChange({ target: { name: "ward", value: name } });
  }, [onFormChange]);

  // Load provinces on mount
  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/p/")
      .then((res) => res.json())
      .then((data) => {
        setCitiesList(data);
        const matched = data.find((c) => c.name === formData.city);
        if (matched) {
          setSelectedCityCode(matched.code);
        } else {
          setSelectedCityCode("");
        }
      })
      .catch((err) => console.error("Lỗi tải danh sách Tỉnh/Thành:", err));
  }, [formData.city]);

  // Load districts when selectedCityCode changes
  useEffect(() => {
    if (!selectedCityCode) return;

    fetch(`https://provinces.open-api.vn/api/p/${selectedCityCode}?depth=2`)
      .then((res) => res.json())
      .then((data) => {
        const list = data.districts || [];
        setDistrictsList(list);

        // Find if current formData.district matches any district name
        const matched = list.find((d) => d.name === formData.district);
        if (matched) {
          setSelectedDistrictCode(matched.code);
        } else {
          setSelectedDistrictCode("");
          if (formData.district) {
            onFormChange({ target: { name: "district", value: "" } });
          }
          if (formData.ward) {
            onFormChange({ target: { name: "ward", value: "" } });
          }
          setWardsList([]);
        }
      })
      .catch((err) => console.error("Lỗi tải danh sách Quận/Huyện:", err));
  }, [formData.district, formData.ward, onFormChange, selectedCityCode]);

  // Load wards when selectedDistrictCode changes
  useEffect(() => {
    if (!selectedDistrictCode) return;

    fetch(`https://provinces.open-api.vn/api/d/${selectedDistrictCode}?depth=2`)
      .then((res) => res.json())
      .then((data) => {
        const list = data.wards || [];
        setWardsList(list);

        // Find if current formData.ward matches any ward name
        const matched = list.find((w) => w.name === formData.ward);
        if (!matched && formData.ward) {
          updateWard("");
        }
      })
      .catch((err) => console.error("Lỗi tải danh sách Phường/Xã:", err));
  }, [formData.ward, selectedDistrictCode, updateWard]);

  const handleCityChange = (e) => {
    const cityName = e.target.value;

    if (!cityName) {
      setSelectedCityCode("");
      setSelectedDistrictCode("");
      setDistrictsList([]);
      setWardsList([]);
      onFormChange({ target: { name: "city", value: "" } });
      onFormChange({ target: { name: "district", value: "" } });
      onFormChange({ target: { name: "ward", value: "" } });
      return;
    }

    const cityObj = citiesList.find((c) => c.name === cityName);
    if (cityObj) {
      updateCity(cityName, cityObj.code);
      setSelectedDistrictCode("");
      setDistrictsList([]);
      setWardsList([]);
      onFormChange({ target: { name: "district", value: "" } });
      onFormChange({ target: { name: "ward", value: "" } });
    }
  };

  const handleDistrictChange = (e) => {
    const districtName = e.target.value;

    if (!districtName) {
      setSelectedDistrictCode("");
      setWardsList([]);
      onFormChange({ target: { name: "district", value: "" } });
      onFormChange({ target: { name: "ward", value: "" } });
      return;
    }

    const districtObj = districtsList.find((d) => d.name === districtName);
    if (districtObj) {
      updateDistrict(districtName, districtObj.code);
      onFormChange({ target: { name: "ward", value: "" } });
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
      {/* Title */}
      <div className="flex items-center gap-3">
        <span className="flex items-center justify-center size-6 rounded-full bg-red-600 text-white text-xs font-bold">1</span>
        <h2 className="text-sm font-bold text-slate-900">Địa chỉ nhận hàng</h2>
      </div>

      {/* Inputs stacked vertically */}
      <div className="space-y-4">
        {/* Name */}
        <div className="space-y-1.5">
          <label htmlFor="fullName" className="block text-sm font-bold text-slate-900">
            Họ và tên
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={onFormChange}
            placeholder=""
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label htmlFor="phone" className="block text-sm font-bold text-slate-900">
            Số điện thoại
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={onFormChange}
            placeholder=""
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-sm font-bold text-slate-900">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={onFormChange}
            placeholder=""
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        </div>

        

        {/* City (dropdown) */}
        <div className="space-y-1.5">
          <label htmlFor="city" className="block text-sm font-bold text-slate-900">
            Tỉnh/Thành phố
          </label>
          <select
            id="city"
            name="city"
            value={formData.city}
            onChange={handleCityChange}
            className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-500"
          >
            <option value="">Chọn tỉnh/thành phố</option>
            {citiesList.map((city) => (
              <option key={city.code} value={city.name}>{city.name}</option>
            ))}
          </select>
        </div>

        {/* District (dropdown) */}
        <div className="space-y-1.5">
          <label htmlFor="district" className="block text-sm font-bold text-slate-900">
            Quận/Huyện
          </label>
          <select
            id="district"
            name="district"
            value={formData.district}
            onChange={handleDistrictChange}
            disabled={!hasSelectedCity}
            className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
          >
            <option value="">Chọn quận/huyện</option>
            {(hasSelectedCity ? districtsList : []).map((d) => (
              <option key={d.code} value={d.name}>{d.name}</option>
            ))}
          </select>
        </div>

        {/* Ward (dropdown) */}
        <div className="space-y-1.5">
          <label htmlFor="ward" className="block text-sm font-bold text-slate-900">
            Phường/Xã
          </label>
          <select
            id="ward"
            name="ward"
            value={formData.ward}
            onChange={onFormChange}
            disabled={!hasSelectedDistrict}
            className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
          >
            <option value="">Chọn phường/xã</option>
            {(hasSelectedDistrict ? wardsList : []).map((w) => (
              <option key={w.code} value={w.name}>{w.name}</option>
            ))}
          </select>
        </div>

        {/* Detailed Address */}
        <div className="space-y-1.5">
          <label htmlFor="address" className="block text-sm font-bold text-slate-900">
            Địa chỉ
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={onFormChange}
            placeholder="Số nhà, tên đường"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        </div>

        {/* Note */}
        <div className="space-y-1.5">
          <label htmlFor="note" className="block text-sm font-bold text-slate-900">
            Ghi chú 
          </label>
          <textarea
            id="note"
            name="note"
            rows="3"
            value={formData.note}
            onChange={onFormChange}
            placeholder="Ghi chú đơn hàng"
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        </div>
      </div>
    </div>
  );
}
