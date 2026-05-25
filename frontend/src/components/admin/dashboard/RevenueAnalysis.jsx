import { TrendingDown, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";

import { formatCurrency } from "@/lib/adminDashboard";

function buildChartPath(points) {
  if (points.length === 0) {
    return "";
  }

  return points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
}

export function RevenueAnalysis({
  data = [],
  startDate,
  endDate,
  onDateChange,
  maxRangeNotice = "",
  minDate,
  maxDate,
}) {
  const [hoveredPointIndex, setHoveredPointIndex] = useState(null);
  const chartWidth = 860;
  const chartHeight = 260;
  const paddingX = 26;
  const paddingY = 20;
  const maxValue = Math.max(1, ...data.map((item) => item.value));
  const stepX = data.length > 1 ? (chartWidth - paddingX * 2) / (data.length - 1) : 0;

  const points = data.map((item, index) => {
    const x = paddingX + index * stepX;
    const normalized = item.value / maxValue;
    const y = chartHeight - paddingY - normalized * (chartHeight - paddingY * 2);
    return { ...item, x, y };
  });

  const currentRevenue = data.reduce((total, item) => total + item.value, 0);
  const midpoint = Math.max(1, Math.floor(data.length / 2));
  const previousRevenue = data.slice(0, midpoint).reduce((total, item) => total + item.value, 0);
  const recentRevenue = data.slice(midpoint).reduce((total, item) => total + item.value, 0);
  const trendDirection = recentRevenue >= previousRevenue ? "up" : "down";
  const chartStroke = trendDirection === "up" ? "#16a34a" : "#dc2626";
  const labelIndexes = new Set(
    points.length <= 3
      ? points.map((_, index) => index)
      : [0, Math.floor((points.length - 1) / 2), points.length - 1],
  );
  const highlightedPointIndexes = useMemo(
    () =>
      new Set(
        points
          .map((point, index) => ({ ...point, index }))
          .filter((point) => point.value > 0)
          .sort((left, right) => right.value - left.value)
          .slice(0, 5)
          .map((point) => point.index),
      ),
    [points],
  );
  const hoveredPoint =
    hoveredPointIndex !== null && highlightedPointIndexes.has(hoveredPointIndex)
      ? points[hoveredPointIndex]
      : null;

  const formatFullDate = (dateKey) => {
    if (!dateKey) {
      return "";
    }

    const date = new Date(`${dateKey}T00:00:00`);
    return Number.isNaN(date.getTime()) ? dateKey : date.toLocaleDateString("vi-VN");
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-gray-900">Biểu đồ doanh thu</h2>
          <p className="text-[12px] font-medium text-gray-500">
            Thống kê theo ngày trong phạm vi tối đa 1 tháng gần nhất
          </p>
          <div className="flex items-center gap-3 text-sm">
            <span className="font-bold text-slate-950">{formatCurrency(currentRevenue)}</span>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                trendDirection === "up" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
              }`}
            >
              {trendDirection === "up" ? (
                <TrendingUp className="h-3.5 w-3.5" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5" />
              )}
              {trendDirection === "up" ? "Xu hướng tăng" : "Xu hướng giảm"}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-end">
          <label className="flex flex-col gap-1 text-[12px] font-semibold text-slate-600">
            Từ ngày
            <input
              type="date"
              value={startDate}
              min={minDate}
              max={endDate}
              onChange={(event) => onDateChange("startDate", event.target.value)}
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
            />
          </label>

          <label className="flex flex-col gap-1 text-[12px] font-semibold text-slate-600">
            Đến ngày
            <input
              type="date"
              value={endDate}
              max={maxDate}
              min={startDate}
              onChange={(event) => onDateChange("endDate", event.target.value)}
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
            />
          </label>
        </div>
      </div>

      {maxRangeNotice ? (
        <p className="mb-4 text-xs font-medium text-amber-600">{maxRangeNotice}</p>
      ) : null}

      <div className="rounded-2xl border border-slate-100 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-4">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight + 34}`} className="h-[320px] w-full">
          {[0, 0.25, 0.5, 0.75, 1].map((tick, index) => {
            const y = chartHeight - paddingY - tick * (chartHeight - paddingY * 2);
            const labelValue = formatCurrency(maxValue * tick);

            return (
              <g key={index}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={chartWidth - paddingX}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeDasharray="5 5"
                />
                <text x={6} y={y + 4} fontSize="11" fill="#94a3b8">
                  {labelValue}
                </text>
              </g>
            );
          })}

          {points.length > 1 ? (
            <path
              d={buildChartPath(points)}
              fill="none"
              stroke={chartStroke}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : null}

          {points.map((point, index) => (
            <g key={point.dateKey}>
              {highlightedPointIndexes.has(index) ? (
                <>
                  <circle cx={point.x} cy={point.y} r="10" fill={chartStroke} fillOpacity="0.12" pointerEvents="none" />
                  <circle cx={point.x} cy={point.y} r="5" fill={chartStroke} pointerEvents="none" />
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="16"
                    fill="transparent"
                    pointerEvents="all"
                    onMouseEnter={() => setHoveredPointIndex(index)}
                    onMouseLeave={() => setHoveredPointIndex((current) => (current === index ? null : current))}
                  />
                </>
              ) : null}
              {labelIndexes.has(index) ? (
                <text x={point.x} y={chartHeight + 18} textAnchor="middle" fontSize="11" fill="#64748b">
                  {point.label}
                </text>
              ) : null}
            </g>
          ))}

          {hoveredPoint ? (
            <g pointerEvents="none">
              <rect
                x={Math.max(paddingX, hoveredPoint.x - 58)}
                y={Math.max(6, hoveredPoint.y - 56)}
                rx="10"
                ry="10"
                width="116"
                height="40"
                fill="#0f172a"
              />
              <text
                x={hoveredPoint.x}
                y={Math.max(20, hoveredPoint.y - 38)}
                textAnchor="middle"
                fontSize="10"
                fill="#cbd5e1"
              >
                {formatFullDate(hoveredPoint.dateKey)}
              </text>
              <text
                x={hoveredPoint.x}
                y={Math.max(36, hoveredPoint.y - 22)}
                textAnchor="middle"
                fontSize="11"
                fill="#ffffff"
              >
                {formatCurrency(hoveredPoint.value)}
              </text>
            </g>
          ) : null}

        </svg>
      </div>
    </div>
  );
}
