import { useState, useEffect } from "react";

export default function CheckoutForm({
  formData,
  onFormChange,
}) {
  const [citiesList, setCitiesList] = useState([]);
  const [districtsList, setDistrictsList] = useState([]);
  const [wardsList, setWardsList] = useState([]);

  const [selectedCityCode, setSelectedCityCode] = useState("");
  const [selectedDistrictCode, setSelectedDistrictCode] = useState("");

  // Load provinces on mount
  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/p/")
      .then((res) => res.json())
      .then((data) => {
        setCitiesList(data);
        // Find if current formData.city matches any province name
        const matched = data.find((c) => c.name === formData.city);
        if (matched) {
          setSelectedCityCode(matched.code);
        } else if (data.length > 0) {
          // If no match, default to first province
          updateCity(data[0].name, data[0].code);
        }
      })
      .catch((err) => console.error("Lỗi tải danh sách Tỉnh/Thành:", err));
  }, []);

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
        } else if (list.length > 0) {
          updateDistrict(list[0].name, list[0].code);
        } else {
          updateDistrict("", "");
        }
      })
      .catch((err) => console.error("Lỗi tải danh sách Quận/Huyện:", err));
  }, [selectedCityCode]);

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
        if (!matched && list.length > 0) {
          updateWard(list[0].name);
        } else if (list.length === 0) {
          updateWard("");
        }
      })
      .catch((err) => console.error("Lỗi tải danh sách Phường/Xã:", err));
  }, [selectedDistrictCode]);

  const updateCity = (name, code) => {
    setSelectedCityCode(code);
    onFormChange({ target: { name: "city", value: name } });
  };

  const updateDistrict = (name, code) => {
    setSelectedDistrictCode(code);
    onFormChange({ target: { name: "district", value: name } });
  };

  const updateWard = (name) => {
    onFormChange({ target: { name: "ward", value: name } });
  };

  const handleCityChange = (e) => {
    const cityName = e.target.value;
    const cityObj = citiesList.find((c) => c.name === cityName);
    if (cityObj) {
      updateCity(cityName, cityObj.code);
    }
  };

  const handleDistrictChange = (e) => {
    const districtName = e.target.value;
    const districtObj = districtsList.find((d) => d.name === districtName);
    if (districtObj) {
      updateDistrict(districtName, districtObj.code);
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
      {/* Title */}
      <div className="flex items-center gap-3">
        <span className="flex items-center justify-center size-6 rounded-full bg-red-600 text-white text-xs font-bold">1</span>
        <h2 className="text-[17px] font-bold text-slate-800">Thông tin giao hàng</h2>
      </div>

      {/* Inputs stacked vertically */}
      <div className="space-y-4">
        {/* Name */}
        <div className="space-y-1.5">
          <label htmlFor="fullName" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">
            Họ và tên
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={onFormChange}
            placeholder=""
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label htmlFor="phone" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">
            Số điện thoại
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={onFormChange}
            placeholder=""
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={onFormChange}
            placeholder=""
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        </div>

        

        {/* City (dropdown) */}
        <div className="space-y-1.5">
          <label htmlFor="city" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">
            Tỉnh/Thành phố
          </label>
          <select
            id="city"
            name="city"
            value={formData.city}
            onChange={handleCityChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500 cursor-pointer"
          >
            {citiesList.map((city) => (
              <option key={city.code} value={city.name}>{city.name}</option>
            ))}
          </select>
        </div>

        {/* District (dropdown) */}
        <div className="space-y-1.5">
          <label htmlFor="district" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">
            Quận/Huyện
          </label>
          <select
            id="district"
            name="district"
            value={formData.district}
            onChange={handleDistrictChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500 cursor-pointer"
          >
            {districtsList.map((d) => (
              <option key={d.code} value={d.name}>{d.name}</option>
            ))}
          </select>
        </div>

        {/* Ward (dropdown) */}
        <div className="space-y-1.5">
          <label htmlFor="ward" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">
            Phường/Xã
          </label>
          <select
            id="ward"
            name="ward"
            value={formData.ward}
            onChange={onFormChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500 cursor-pointer"
          >
            {wardsList.map((w) => (
              <option key={w.code} value={w.name}>{w.name}</option>
            ))}
          </select>
        </div>

        {/* Detailed Address */}
        <div className="space-y-1.5">
          <label htmlFor="address" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">
            Địa chỉ
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={onFormChange}
            placeholder="Số nhà, tên đường"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        </div>

        {/* Note */}
        <div className="space-y-1.5">
          <label htmlFor="note" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">
            Ghi chú 
          </label>
          <textarea
            id="note"
            name="note"
            rows="3"
            value={formData.note}
            onChange={onFormChange}
            placeholder="Ghi chú đơn hàng"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-red-500 resize-none"
          />
        </div>
      </div>
    </div>
  );
}

