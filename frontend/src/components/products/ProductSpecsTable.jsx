export function ProductSpecsTable({ specs = {} }) {
  const specEntries = Object.entries(specs);

  if (specEntries.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-gray-500 font-semibold bg-white border border-slate-100 rounded-lg">
        Không có thông số kỹ thuật cho sản phẩm này.
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm">
      <table className="w-full text-left text-sm border-collapse">
        <tbody>
          {specEntries.map(([key, val], idx) => {
            const isEven = idx % 2 === 0;
            return (
              <tr
                key={key}
                className={`transition-colors hover:bg-slate-100/50 ${
                  isEven ? "bg-slate-50/50" : "bg-white"
                }`}
              >
                <td className="w-1/3 py-3.5 px-6 font-semibold text-gray-600 border-b border-slate-100/80">
                  {key}
                </td>
                <td className="py-3.5 px-6 text-gray-800 font-medium border-b border-slate-100/80">
                  {val}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
