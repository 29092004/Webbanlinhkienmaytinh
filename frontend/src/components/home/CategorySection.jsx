import { Cpu, CircuitBoard, MemoryStick, HardDrive, Power, Server, Box, Fan } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  { name: "CPU", icon: Cpu, id: "cpu" },
  { name: "GPU", icon: CircuitBoard, id: "gpu" },
  { name: "RAM", icon: MemoryStick, id: "ram" },
  { name: "SSD", icon: HardDrive, id: "ssd" },
  { name: "PSU", icon: Power, id: "psu" },
  { name: "Mainboard", icon: Server, id: "motherboard" },
  { name: "Vỏ Case", icon: Box, id: "case" },
  { name: "Tản Nhiệt", icon: Fan, id: "cooler" },
];

export function CategorySection() {
  return (
    <section className="bg-[#f8f9fa] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Khám phá theo danh mục
          </h2>
          <Link to="/products" className="text-blue-600 hover:underline text-sm font-medium">
            Tất cả &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((cat, i) => (
            <Link
              key={i}
              to={`/products?category=${cat.id}`}
              className="bg-white rounded-lg p-4 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100"
            >
              <div className="w-12 h-12 flex items-center justify-center mb-3">
                <cat.icon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-sm font-bold text-gray-900">{cat.name}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

