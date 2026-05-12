import { ShoppingCart, User } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <a href="/" className="font-bold text-xl tracking-wider text-gray-900 uppercase">
              EXO CORE
            </a>
            <nav className="hidden md:flex space-x-8 text-sm">
              <a href="/" className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-1">Home</a>
              <a href="/products" className="text-gray-500 hover:text-gray-900 font-medium">Products</a>
              <a href="/pc-builder" className="text-gray-500 hover:text-gray-900 font-medium">PC Builder</a>
              <a href="/promotions" className="text-gray-500 hover:text-gray-900 font-medium">Promotions</a>
              <a href="/news" className="text-gray-500 hover:text-gray-900 font-medium">News</a>
              <a href="/contact" className="text-gray-500 hover:text-gray-900 font-medium">Contact</a>
            </nav>
          </div>
          <div className="flex items-center space-x-6 text-gray-500">
            <button className="hover:text-gray-900 transition-colors">
              <ShoppingCart className="w-5 h-5" />
            </button>
            <button className="hover:text-gray-900 transition-colors">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
