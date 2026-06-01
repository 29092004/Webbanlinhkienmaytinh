import { useEffect, useState, useMemo } from "react";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { api } from "@/lib/api";
import { addProductToCart } from "@/lib/cartStore";
import { showToast } from "@/lib/toast";
import { PCBuilderRow } from "@/components/pc-builder/PCBuilderRow";
import { PCBuilderSelectorModal } from "@/components/pc-builder/PCBuilderSelectorModal";
import { PCBuilderPresets } from "@/components/pc-builder/PCBuilderPresets";
import {
  Download,
  FileSpreadsheet,
  Printer,
  ShoppingCart,
  RotateCcw,
} from "lucide-react";
import * as XLSX from "xlsx";
import { calculateDiscountedPrice } from "@/components/admin/product/productUtils";

const BUILDER_SLOTS = [
  { id: 1, name: "CPU (Vi xử lý)", category_name: "CPU" },
  { id: 2, name: "Cooling Fan (Tản nhiệt)", category_name: "Cooling Fan" },
  { id: 3, name: "Mainboard (Bo mạch chủ)", category_name: "Mainboard" },
  { id: 4, name: "RAM (Bộ nhớ trong)", category_name: "RAM" },
  { id: 5, name: "SSD (Ổ cứng tốc độ cao)", category_name: "SSD" },
  { id: 6, name: "HDD (Ổ cứng lưu trữ)", category_name: "HDD" },
  { id: 7, name: "GPU (Card đồ họa)", category_name: "GPU" },
  { id: 8, name: "Power Supply (Nguồn)", category_name: "Power Supply" },
  { id: 9, name: "Case PC (Vỏ máy tính)", category_name: "Case PC" },
  { id: 10, name: "Monitor (Màn hình)", category_name: "Monitor" },
  { id: 11, name: "Keyboard (Bàn phím)", category_name: "Keyboard" },
  { id: 12, name: "Mouse (Chuột)", category_name: "Mouse" },
  { id: 13, name: "Headphone (Tai nghe)", category_name: "Headphone" },
  { id: 14, name: "Speaker (Loa)", category_name: "Speaker" },
  { id: 15, name: "Router (Thiết bị mạng)", category_name: "Router" }
];

export default function PCBuilder() {
  const [allProducts, setAllProducts] = useState([]);
  const activeTab = 1;
  const [configs, setConfigs] = useState({
    1: {},
    2: {},
    3: {},
    4: {},
    5: {},
  });
  const [activeSlot, setActiveSlot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddingAllToCart, setIsAddingAllToCart] = useState(false);

  // Fetch all products on mount
  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        if (isMounted) {
          const products = Array.isArray(response.data?.data) ? response.data.data : [];
          setAllProducts(products);
          
          // Load configs from localStorage
          const loadedConfigs = { 1: {}, 2: {}, 3: {}, 4: {}, 5: {} };
          for (let tab = 1; tab <= 5; tab++) {
            const key = `exo_pc_build_tab_${tab}`;
            const saved = localStorage.getItem(key);
            if (saved) {
              try {
                const parsed = JSON.parse(saved);
                // Map products back into objects by checking against fetched products
                const resolved = {};
                Object.entries(parsed).forEach(([slotId, item]) => {
                  const prod = products.find((p) => p.id === item.productId);
                  if (prod) {
                    resolved[slotId] = {
                      product: prod,
                      quantity: item.quantity || 1,
                    };
                  }
                });
                loadedConfigs[tab] = resolved;
              } catch (e) {
                console.error("Failed to parse saved config for tab " + tab, e);
              }
            }
          }
          setConfigs(loadedConfigs);
        }
      } catch (error) {
        console.error("Failed to load products for PC Builder", error);
      }
    };
    fetchProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  const currentConfig = useMemo(() => configs[activeTab] || {}, [configs, activeTab]);

  const totalPrice = useMemo(() => {
    return Object.values(currentConfig).reduce((sum, item) => {
      const pricing = calculateDiscountedPrice({
        retailPrice: item.product.retail_price,
        saleType: item.product.sale_type,
        saleValue: item.product.sale_value,
        isOnSale: Boolean(item.product.sale_id),
      });
      return sum + (pricing.finalPrice * item.quantity);
    }, 0);
  }, [currentConfig]);

  // Save current config to localStorage helper
  const saveConfig = (tabNum, newConfig) => {
    const key = `exo_pc_build_tab_${tabNum}`;
    const simplified = {};
    Object.entries(newConfig).forEach(([slotId, item]) => {
      simplified[slotId] = {
        productId: item.product.id,
        quantity: item.quantity,
      };
    });
    localStorage.setItem(key, JSON.stringify(simplified));
  };

  // Handle selecting a component for a slot
  const handleSelectProduct = (product) => {
    if (!activeSlot) return;
    const nextConfig = {
      ...currentConfig,
      [activeSlot.id]: {
        product,
        quantity: 1,
      },
    };
    setConfigs({
      ...configs,
      [activeTab]: nextConfig,
    });
    saveConfig(activeTab, nextConfig);
    setIsModalOpen(false);
    showToast({ message: `Đã chọn ${product.name} làm ${activeSlot.name}.`, type: "success" });
  };

  // Handle removing a component from a slot
  const handleRemoveProduct = (slotId) => {
    const nextConfig = { ...currentConfig };
    delete nextConfig[slotId];
    setConfigs({
      ...configs,
      [activeTab]: nextConfig,
    });
    saveConfig(activeTab, nextConfig);
    showToast({ message: "Đã xóa linh kiện khỏi cấu hình.", type: "success" });
  };

  // Handle quantity changes
  const handleQtyChange = (slotId, newQty) => {
    if (newQty < 1) return;
    const nextConfig = {
      ...currentConfig,
      [slotId]: {
        ...currentConfig[slotId],
        quantity: newQty,
      },
    };
    setConfigs({
      ...configs,
      [activeTab]: nextConfig,
    });
    saveConfig(activeTab, nextConfig);
  };

  // Reset/Clear config
  const handleResetConfig = () => {
    setConfigs({
      ...configs,
      [activeTab]: {},
    });
    localStorage.removeItem(`exo_pc_build_tab_${activeTab}`);
    showToast({ message: `Đã làm mới Cấu hình ${activeTab}.`, type: "success" });
  };

  // Load preset config
  const handleSelectPreset = (partsMap) => {
    if (allProducts.length === 0) return;
    const resolved = {};
    Object.entries(partsMap).forEach(([slotId, productId]) => {
      const prod = allProducts.find((p) => p.id === productId);
      if (prod) {
        resolved[slotId] = {
          product: prod,
          quantity: 1,
        };
      }
    });
    const nextConfigs = {
      ...configs,
      [activeTab]: resolved,
    };
    setConfigs(nextConfigs);
    saveConfig(activeTab, resolved);
    showToast({ message: "Đã tải cấu hình gợi ý sẵn thành công!", type: "success" });
  };

  // Add all selected products to cart
  const handleAddAllToCart = async () => {
    const items = Object.values(currentConfig);
    if (items.length === 0) {
      showToast({ message: "Chưa chọn linh kiện nào để thêm vào giỏ hàng.", type: "warning" });
      return;
    }

    try {
      setIsAddingAllToCart(true);
      for (const item of items) {
        await addProductToCart({ productId: item.product.id, quantity: item.quantity });
      }
      const clearedConfig = {};
      setConfigs({
        ...configs,
        [activeTab]: clearedConfig,
      });
      localStorage.removeItem(`exo_pc_build_tab_${activeTab}`);
      showToast({
        message: `Đã thêm tất cả ${items.length} linh kiện vào giỏ hàng và làm trống cấu hình hiện tại!`,
        type: "success",
      });
    } catch (error) {
      console.error("Failed to add all components to cart", error);
      showToast({ message: "Không thêm được linh kiện vào giỏ hàng.", type: "error" });
    } finally {
      setIsAddingAllToCart(false);
    }
  };

  // Export config to Excel file
  const handleExportExcel = () => {
    const items = Object.entries(currentConfig);
    if (items.length === 0) {
      showToast({ message: "Cấu hình trống, không thể xuất file Excel.", type: "warning" });
      return;
    }

    const data = items.map(([slotId, item], index) => {
      const slot = BUILDER_SLOTS.find((s) => s.id === Number(slotId));
      const pricing = calculateDiscountedPrice({
        retailPrice: item.product.retail_price,
        saleType: item.product.sale_type,
        saleValue: item.product.sale_value,
        isOnSale: Boolean(item.product.sale_id),
      });
      return {
        "STT": index + 1,
        "Linh kiện": slot?.name || "",
        "Tên sản phẩm": item.product.name,
        "Thương hiệu": item.product.brand_name || "",
        "Số lượng": item.quantity,
        "Đơn giá (đ)": pricing.finalPrice,
        "Thành tiền (đ)": pricing.finalPrice * item.quantity,
      };
    });

    // Add totals row
    data.push({
      "STT": "",
      "Linh kiện": "TỔNG CHI PHÍ DỰ TÍNH",
      "Tên sản phẩm": "",
      "Thương hiệu": "",
      "Số lượng": "",
      "Đơn giá (đ)": "",
      "Thành tiền (đ)": totalPrice,
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Cấu hình PC");
    XLSX.writeFile(wb, `cau_hinh_pc_cau_hinh_${activeTab}.xlsx`);
    showToast({ message: "Đã tải xuống file Excel cấu hình thành công!", type: "success" });
  };

  // Export config as Image (HTML Canvas Drawing)
  const handleExportImage = () => {
    const items = Object.entries(currentConfig);
    if (items.length === 0) {
      showToast({ message: "Cấu hình trống, không thể tải ảnh.", type: "warning" });
      return;
    }

    // Create Canvas
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const itemHeight = 45;
    const headerHeight = 120;
    const footerHeight = 80;
    const canvasWidth = 800;
    const canvasHeight = headerHeight + (items.length * itemHeight) + footerHeight;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Draw background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw header banner
    ctx.fillStyle = "#1d4ed8"; // Blue 700
    ctx.fillRect(0, 0, canvasWidth, 70);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText("EXO CORE - CẤU HÌNH PC XÂY DỰNG", 30, 42);

    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 70, canvasWidth, 50);

    // Draw table headers
    ctx.fillStyle = "#475569";
    ctx.font = "bold 12px sans-serif";
    ctx.fillText("Linh kiện", 30, 100);
    ctx.fillText("Sản phẩm chọn mua", 220, 100);
    ctx.fillText("SL", 560, 100);
    ctx.fillText("Giá bán", 620, 100);
    ctx.fillText("Thành tiền", 710, 100);

    // Draw items
    let currentY = headerHeight;
    ctx.font = "12px sans-serif";

    items.forEach(([slotId, item], index) => {
      const slot = BUILDER_SLOTS.find((s) => s.id === Number(slotId));
      const pricing = calculateDiscountedPrice({
        retailPrice: item.product.retail_price,
        saleType: item.product.sale_type,
        saleValue: item.product.sale_value,
        isOnSale: Boolean(item.product.sale_id),
      });
      const finalPrice = pricing.finalPrice;
      
      // Zebra striping
      if (index % 2 === 0) {
        ctx.fillStyle = "#f8fafc";
        ctx.fillRect(0, currentY, canvasWidth, itemHeight);
      }

      ctx.fillStyle = "#475569";
      ctx.fillText(slot?.name || "", 30, currentY + 26);
      
      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 12px sans-serif";
      // Truncate name if too long
      let displayName = item.product.name;
      if (displayName.length > 40) displayName = displayName.substring(0, 37) + "...";
      ctx.fillText(displayName, 220, currentY + 26);

      ctx.font = "12px sans-serif";
      ctx.fillStyle = "#475569";
      ctx.fillText(String(item.quantity), 560, currentY + 26);
      ctx.fillText(finalPrice.toLocaleString("vi-VN") + "đ", 620, currentY + 26);
      
      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText((finalPrice * item.quantity).toLocaleString("vi-VN") + "đ", 710, currentY + 26);

      // Draw horizontal line
      ctx.strokeStyle = "#f1f5f9";
      ctx.beginPath();
      ctx.moveTo(30, currentY + itemHeight);
      ctx.lineTo(770, currentY + itemHeight);
      ctx.stroke();

      currentY += itemHeight;
    });

    // Draw total block in footer
    ctx.fillStyle = "#ef4444"; // Red 500
    ctx.font = "bold 16px sans-serif";
    ctx.fillText(`Tổng chi phí dự tính: ${totalPrice.toLocaleString("vi-VN")} đ`, 440, currentY + 40);

    // Draw footer link
    ctx.fillStyle = "#94a3b8";
    ctx.font = "italic 11px sans-serif";
    ctx.fillText("Cấu hình được tạo tại Website EXO CORE PC Builder", 30, currentY + 40);

    // Trigger download
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `cau_hinh_pc_tab_${activeTab}.png`;
    a.click();
    showToast({ message: "Đã tải xuống ảnh cấu hình thành công!", type: "success" });
  };

  // View and Print Config
  const handlePrint = () => {
    const items = Object.entries(currentConfig);
    if (items.length === 0) {
      showToast({ message: "Cấu hình trống, không thể in.", type: "warning" });
      return;
    }

    const printWindow = window.open("", "_blank");
    const rowsHtml = items.map(([slotId, item], index) => {
      const slot = BUILDER_SLOTS.find((s) => s.id === Number(slotId));
      const pricing = calculateDiscountedPrice({
        retailPrice: item.product.retail_price,
        saleType: item.product.sale_type,
        saleValue: item.product.sale_value,
        isOnSale: Boolean(item.product.sale_id),
      });
      const finalPrice = pricing.finalPrice;
      return `
        <tr>
          <td>${index + 1}</td>
          <td><b>${slot?.name || ""}</b></td>
          <td>${item.product.name}</td>
          <td>${item.quantity}</td>
          <td>${finalPrice.toLocaleString("vi-VN")} đ</td>
          <td style="text-align: right; font-weight: bold;">${(finalPrice * item.quantity).toLocaleString("vi-VN")} đ</td>
        </tr>
      `;
    }).join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>Bản in cấu hình PC - EXO CORE</title>
          <style>
            body { font-family: sans-serif; padding: 30px; color: #1e293b; line-height: 1.5; }
            h1 { color: #1d4ed8; font-weight: 900; margin-bottom: 5px; }
            p { margin: 5px 0; color: #64748b; font-size: 13px; }
            table { width: 100%; border-collapse: collapse; margin-top: 30px; }
            th, td { border-bottom: 1px solid #e2e8f0; padding: 12px; text-align: left; font-size: 13px; }
            th { background-color: #f8fafc; color: #475569; font-weight: bold; }
            .total-block { text-align: right; margin-top: 30px; border-top: 2px solid #e2e8f0; padding-top: 15px; }
            .total-title { font-size: 14px; font-weight: bold; color: #64748b; }
            .total-val { font-size: 20px; font-weight: 900; color: #ef4444; margin-top: 5px; }
            @media print {
              body { padding: 10px; }
            }
          </style>
        </head>
        <body>
          <h1>EXO CORE PC BUILDER</h1>
          <p>Cấu hình PC được xây dựng tự chọn tại hệ thống cửa hàng Exo Core</p>
          <p>Ngày in: ${new Date().toLocaleDateString("vi-VN")} | Cấu hình số: ${activeTab}</p>

          <table>
            <thead>
              <tr>
                <th style="width: 40px;">STT</th>
                <th style="width: 180px;">Linh kiện</th>
                <th>Tên sản phẩm</th>
                <th style="width: 50px;">SL</th>
                <th style="width: 120px;">Đơn giá</th>
                <th style="width: 140px; text-align: right;">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>

          <div className="total-block" style="text-align: right;">
            <div className="total-title">TỔNG CHI PHÍ DỰ TÍNH</div>
            <div className="total-val">${totalPrice.toLocaleString("vi-VN")} đ</div>
          </div>

          <script>
            window.onload = function() {
              window.print();
              window.close();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans tracking-[-0.01em] text-slate-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 space-y-6">
        {/* Breadcrumbs */}
        <Breadcrumb
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Xây dựng cấu hình PC" }
          ]}
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-100 p-4 rounded-3xl shadow-sm">
          <div>
            <span className="text-base font-semibold text-slate-900 tracking-[-0.01em]">
              Cấu hình PC của bạn
            </span>
          </div>

          {/* Reset and Estimate Cost */}
          <div className="flex items-center justify-between sm:justify-end gap-6">
            <button
              onClick={handleResetConfig}
              className="text-sm font-semibold text-slate-500 hover:text-red-500 transition flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="size-3.5" />
              Làm mới 🔄
            </button>
            <div className="text-right">
              <span className="text-[11px] font-medium text-slate-400 block">
                Chi phí dự tính
              </span>
              <span className="text-xl font-bold text-red-600">
                {totalPrice.toLocaleString("vi-VN")} đ
              </span>
            </div>
          </div>
        </div>

        {/* Builder Rows List */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-2">
          <div className="divide-y divide-slate-100">
            {BUILDER_SLOTS.map((slot, index) => (
              <PCBuilderRow
                key={slot.id}
                index={index}
                slot={slot}
                selectedProduct={currentConfig[slot.id]?.product}
                quantity={currentConfig[slot.id]?.quantity || 1}
                onSelectClick={() => {
                  setActiveSlot(slot);
                  setIsModalOpen(true);
                }}
                onRemoveClick={handleRemoveProduct}
                onQtyChange={handleQtyChange}
              />
            ))}
          </div>

          {/* Total Sum & Action Buttons */}
          <div className="pt-8 border-t border-slate-100 flex flex-col items-stretch md:items-end gap-6">
            <div className="text-right">
              <span className="text-sm font-medium text-slate-400 block">
                Tổng chi phí cấu hình
              </span>
              <span className="text-2xl font-bold text-red-600 mt-1 block">
                {totalPrice.toLocaleString("vi-VN")} đ
              </span>
            </div>

            {/* Bottom Actions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 w-full">
              <button
                onClick={handleExportImage}
                className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold py-3 px-4 rounded-2xl text-sm flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Download className="size-4 shrink-0 text-slate-400" />
                Tải ảnh cấu hình
              </button>

              <button
                onClick={handleExportExcel}
                className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold py-3 px-4 rounded-2xl text-sm flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <FileSpreadsheet className="size-4 shrink-0 text-slate-400" />
                Xuất file Excel
              </button>

              <button
                onClick={handlePrint}
                className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold py-3 px-4 rounded-2xl text-sm flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Printer className="size-4 shrink-0 text-slate-400" />
                Xem và in
              </button>

              <button
                onClick={handleAddAllToCart}
                disabled={isAddingAllToCart}
                className="bg-[#e21a36] hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-2xl text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:bg-red-300"
              >
                <ShoppingCart className="size-4 shrink-0" />
                Thêm hết vào giỏ hàng
              </button>
            </div>
          </div>
        </div>

        {/* Presets and Budget recommendations */}
        <PCBuilderPresets
          onSelectPreset={handleSelectPreset}
        />
      </main>

      {/* Product Selection Modal */}
      <PCBuilderSelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        slot={activeSlot}
        onSelect={handleSelectProduct}
      />

      <Footer />
    </div>
  );
}
