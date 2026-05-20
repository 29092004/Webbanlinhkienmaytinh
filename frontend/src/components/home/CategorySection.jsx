import { Cpu, CircuitBoard, MemoryStick, HardDrive, Power, Server, Box, Fan } from "lucide-react";

const categories = [
  { name: "CPU", icon: Cpu },
  { name: "GPU", icon: CircuitBoard },
  { name: "RAM", icon: MemoryStick },
  { name: "SSD", icon: HardDrive },
  { name: "PSU", icon: Power },
  { name: "Mainboard", icon: Server },
  { name: "Vỏ Case", icon: Box },
  { name: "Tản Nhiệt", icon: Fan },
];

export function CategorySection() {
  return (
    <section className="bg-[#f8f9fa] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Khám phá theo danh mục
          </h2>
          <a href="/categories" className="text-blue-600 hover:underline text-sm font-medium">
            Tất cả &rarr;
          </a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((cat, i) => (
            <div key={i} className="bg-white rounded-lg p-4 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100">
              <div className="w-12 h-12 flex items-center justify-center mb-3">
                <cat.icon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-sm font-bold text-gray-900">{cat.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
