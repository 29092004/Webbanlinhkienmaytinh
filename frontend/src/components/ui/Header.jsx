import { ShoppingCart, User } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <a href="/" className="text-xl font-bold uppercase tracking-wider text-gray-900">
              EXO CORE
            </a>
            <nav className="hidden space-x-8 text-sm md:flex">
              <a href="/" className="border-b-2 border-blue-600 pb-1 font-semibold text-blue-600">
                Home
              </a>
              <a href="/products" className="font-medium text-gray-500 hover:text-gray-900">
                Products
              </a>
              <a href="/pc-builder" className="font-medium text-gray-500 hover:text-gray-900">
                PC Builder
              </a>
              <a href="/promotions" className="font-medium text-gray-500 hover:text-gray-900">
                Promotions
              </a>
              <a href="/news" className="font-medium text-gray-500 hover:text-gray-900">
                News
              </a>
              <a href="/contact" className="font-medium text-gray-500 hover:text-gray-900">
                Contact
              </a>
            </nav>
          </div>

          <div className="flex items-center space-x-6 text-gray-500">
            <button type="button" className="transition-colors hover:text-gray-900">
              <ShoppingCart className="size-5" />
            </button>
            <button type="button" className="transition-colors hover:text-gray-900">
              <User className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
