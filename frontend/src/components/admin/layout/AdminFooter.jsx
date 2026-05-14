import { Grid } from "lucide-react";

export function AdminFooter() {
  return (
    <footer className="mt-12 py-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 text-[13px]">
      <div className="flex items-center gap-3">
        <div className="bg-blue-600 text-white p-1.5 rounded-lg">
          <Grid className="w-4 h-4" />
        </div>
        <span className="font-bold text-gray-900 tracking-tight">Admin LinhKienMayTinh</span>
      </div>
      
      <div className="text-gray-400 font-medium">
        &copy; 2024 LinhKienMayTinh Admin Panel. Thiết kế bởi Đội ngũ Phát triển Nội bộ.
      </div>
      
      <div className="flex items-center gap-8 font-bold text-gray-500">
        <a href="#" className="hover:text-blue-600 transition-colors">Bảo mật</a>
        <a href="#" className="hover:text-blue-600 transition-colors">Hỗ trợ</a>
        <a href="#" className="hover:text-blue-600 transition-colors">Liên hệ</a>
      </div>
    </footer>
  );
}
