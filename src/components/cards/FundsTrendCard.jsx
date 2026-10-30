import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function FundsTrendCard({ data, year, isLoading = false }) {
  return (
    <section
      aria-busy={isLoading}
      className="mt-4 flex min-h-80 w-full min-w-80 flex-col items-center justify-start rounded-2xl border border-gray-100 bg-white p-5 shadow-lg transition-shadow hover:shadow-xl"
    >
      <div className="w-full">
        <h2 className="text-md font-bold text-green-800">
          Revenues and Expenses
        </h2>
        <p className="text-xs text-gray-600">
          Monthly completed order revenue and recorded expenses for {year}
        </p>
      </div>
      {isLoading ? (
        <div
          aria-hidden="true"
          className="mt-4 flex h-96 w-full animate-pulse flex-col justify-between rounded-xl bg-gray-50 p-4"
        >
          <div className="flex h-full items-end justify-between gap-2 border-b border-l border-gray-200 px-2">
            {[42, 58, 35, 70, 48, 82, 56, 68, 40, 75, 51, 63].map(
              (height, index) => (
                <div key={index} className="flex h-full flex-1 items-end gap-1">
                  <div
                    className="w-full rounded-t bg-red-100"
                    style={{ height: `${height}%` }}
                  />
                  <div
                    className="w-full rounded-t bg-green-100"
                    style={{ height: `${Math.min(height + 12, 94)}%` }}
                  />
                </div>
              ),
            )}
          </div>
          <div className="mt-3 flex justify-end gap-4">
            <div className="h-3 w-16 rounded bg-gray-200" />
            <div className="h-3 w-16 rounded bg-gray-200" />
          </div>
        </div>
      ) : (
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="revenueColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#166534" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#dcfce7" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#991B1B" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#FEE2E2" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fadeGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="3%" stopColor="black" />
                  <stop offset="10%" stopColor="white" />
                  <stop offset="90%" stopColor="white" />
                  <stop offset="99%" stopColor="black" />
                </linearGradient>
                <mask id="fadeEdges">
                  <rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    fill="url(#fadeGradient)"
                  />
                </mask>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#D1D5DB"
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tick={{ fill: "#166534", fontSize: 12, fontWeight: 500 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#166534", fontSize: 12, fontWeight: 500 }}
              />
              <Tooltip
                formatter={(value) =>
                  Number(value).toLocaleString("en-PH", {
                    style: "currency",
                    currency: "PHP",
                  })
                }
                contentStyle={{
                  borderRadius: "16px",
                  border: "none",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  opacity: 0.9,
                }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                height={24}
                iconType="circle"
                wrapperStyle={{ fontSize: "12px", color: "#4b5563" }}
              />
              <Area
                type="monotone"
                dataKey="expense"
                stroke="#991B1B"
                strokeWidth={1}
                fillOpacity={1}
                fill="url(#expenseColor)"
                mask="url(#fadeEdges)"
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#166534"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#revenueColor)"
                mask="url(#fadeEdges)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
