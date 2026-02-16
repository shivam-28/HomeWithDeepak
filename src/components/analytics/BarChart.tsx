"use client";

interface BarChartProps {
  data: { label: string; value: number; color: string }[];
  title: string;
}

export function BarChart({ data, title }: BarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      <div className="space-y-2">
        {data.map((item) => (
          <div key={item.label} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">{item.label}</span>
              <span className="font-medium text-gray-900">{item.value}</span>
            </div>
            <div className="h-6 w-full rounded-full bg-gray-100">
              <div
                className={`h-6 rounded-full transition-all duration-500 ${item.color}`}
                style={{
                  width: `${Math.max((item.value / max) * 100, item.value > 0 ? 8 : 0)}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
