import { Rocket } from "lucide-react";

export function AdminFooter() {
  return (
    <footer className="mt-12 py-6 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
      <div className="flex items-center gap-2">
        <div className="bg-blue-600 text-white p-1 rounded">
          <Rocket className="w-3 h-3" />
        </div>
        <span className="font-extrabold text-gray-900 tracking-tight">EXO CORE</span>
      </div>
      
      <div className="text-gray-400">
        &copy; 2024 EXO CORE High-Performance Systems. Designed for peak performance.
      </div>
      
      <div className="flex items-center gap-6 font-bold text-gray-500">
        <a href="#" className="hover:text-gray-900 transition-colors uppercase tracking-wider">Privacy</a>
        <a href="#" className="hover:text-gray-900 transition-colors uppercase tracking-wider">Warranty</a>
        <a href="#" className="hover:text-gray-900 transition-colors uppercase tracking-wider">Contact</a>
      </div>
    </footer>
  );
}
