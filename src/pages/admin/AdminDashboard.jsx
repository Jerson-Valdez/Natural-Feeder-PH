//icons
import {
  IconArchive,
  IconCalendarCancel,
  IconActivityHeartbeat,
  IconChartAreaLine,
  IconTrendingUp,
  IconCashMinus,
  IconChartArrowsVertical,
  IconWallet,
  IconCashMove,
  IconPercentage,
} from "@tabler/icons-react";

//components
import DashboardCard from "../../components/cards/DashboardCard";
import { toast } from "sonner";

//hooks
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";

export default function AdminDashboard() {
  const [totalOrders, setTotalOrders] = useState(0);
  const [activeOrders, setActiveOrders] = useState(0);
  const [cancelledOrders, setCancelledOrders] = useState(0);
  const [revenueMonth, setRevenueMonth] = useState(0);
  const [expensesMonth, setExpensesMonth] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [netProfit, setNetProfit] = useState(0);
  const [profitMargin, setProfitMargin] = useState(0);

  const [years, setYears] = useState(["2023", "2024", "2025"]);

  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  const [fundsTrend, setFundsTrend] = useState([
    { month: "Jan", expense: 4000, revenue: 2400 },
    { month: "Feb", expense: 3000, revenue: 1398 },
    { month: "Mar", expense: 2000, revenue: 3200 },
    { month: "Apr", expense: 2780, revenue: 3908 },
    { month: "May", expense: 1890, revenue: 4800 },
    { month: "Jun", expense: 2390, revenue: 3800 },
    { month: "Jul", expense: 3490, revenue: 4300 },
    { month: "Aug", expense: 4000, revenue: 2400 },
    { month: "Sep", expense: 3000, revenue: 1398 },
    { month: "Oct", expense: 2000, revenue: 3200 },
    { month: "Nov", expense: 2780, revenue: 3908 },
    { month: "Dec", expense: 1890, revenue: 4800 },
  ]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "orders"));

        const productsArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setTotalOrders(productsArray.length);

        const activeCount = productsArray.filter(
          (order) => order.status === "active" || order.status === "pending"
        ).length;
        setActiveOrders(activeCount);

        const cancelledCount = productsArray.filter(
          (order) => order.status === "cancelled"
        ).length;
        setCancelledOrders(cancelledCount);

      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to fetch Dashboard data. Please try again later.");
      } finally {
        // Note: Make sure you have const [isLoading, setIsLoading] = useState(true); declared above!
        // setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, [selectedMonth, selectedYear]);

  const dashboardCardsDataTop = [
    {
      title: "Active Orders",
      value: activeOrders,
      icon: IconActivityHeartbeat,
      color: "green",
      isValueCurrency: false,
      additionalClasses: "top",
    },
    {
      title: "Cancelled Orders",
      value: cancelledOrders,
      icon: IconCalendarCancel,
      color: "red",
      isValueCurrency: false,
      additionalClasses: "top",
    },
    {
      title: "Total Orders",
      value: totalOrders,
      icon: IconArchive,
      color: "blue",
      isValueCurrency: false,
      additionalClasses: "top",
    },
  ];

  const dashboardCardsDataBottom = [
    {
      title: "Revenue (Month)",
      value: revenueMonth,
      icon: IconCashMove,
      color: "green",
      isValueCurrency: true,
    },
    {
      title: "Expenses (Month)",
      value: expensesMonth,
      icon: IconCashMinus,
      color: "red",
      isValueCurrency: true,
    },
    {
      title: "Revenue (Year)",
      value: totalOrders,
      icon: IconChartArrowsVertical,
      color: "blue",
      isValueCurrency: true,
    },
    {
      title: "Expenses (Year)",
      value: totalExpenses,
      icon: IconWallet,
      color: "yellow",
      isValueCurrency: true,
    },
    {
      title: "Net Profit (Year)",
      value: netProfit,
      icon: IconTrendingUp,
      color: "green",
      isValueCurrency: true,
    },
    {
      title: "Profit Margin (Year %)",
      value: profitMargin,
      icon: IconPercentage,
      color: "green",
      isValueCurrency: false,
    },
  ];

  const months = [
    { value: "january", label: "January" },
    { value: "february", label: "February" },
    { value: "march", label: "March" },
    { value: "april", label: "April" },
    { value: "may", label: "May" },
    { value: "june", label: "June" },
    { value: "july", label: "July" },
    { value: "august", label: "August" },
    { value: "september", label: "September" },
    { value: "october", label: "October" },
    { value: "november", label: "November" },
    { value: "december", label: "December" },
  ];

  return (
    <main className="page-container">
      <div className="w-full flex flex-col items-start justify-center gap-1 text-center">
        <h1 className="text-xl font-bold text-green-800">Admin Dashboard</h1>
        <p className="text-sm text-gray-600">
          Manage your store and monitor your sales performance.
        </p>
      </div>
      <div className="flex flex-row flex-wrap w-full items-center justify-start gap-2 mt-2">
        {dashboardCardsDataTop.map((card, index) => (
          <DashboardCard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
            isValueCurrency={card.isValueCurrency}
          />
        ))}
      </div>
      <div className="flex flex-row w-full items-center justify-start gap-2 py-2">
        <div className="flex-1 flex flex-col items-start justify-start">
          <div className="flex flex-row items-center justify-start gap-2">
            <IconChartAreaLine size={24} className="text-green-800" />
            <h2 className="text-lg font-semibold text-green-800">
              Overview of Funds
            </h2>
          </div>
          <p className="text-sm text-gray-600">
            {selectedMonth} {selectedYear}
          </p>
        </div>
        <select
          name="month"
          id="month"
          className="bg-transparent text-green-800 font-semibold border border-gray-200 rounded-2xl shadow-md px-2 py-2 focus:outline-none focus:ring-2 focus:ring-green-800 cursor-pointer hover:-translate-y-0.5 hover:ring-1 transition-all duration-300"
          defaultValue={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          {months.map((month) => (
            <option
              key={month.value}
              value={month.value}
              className="text-green-800 text-xs"
            >
              {month.label}
            </option>
          ))}
        </select>
        <select
          name="year"
          id="year"
          defaultValue={selectedYear}
          className="bg-transparent text-green-800 font-semibold border border-gray-200 rounded-2xl shadow-md px-2 py-2 focus:outline-none focus:ring-2 focus:ring-green-800 cursor-pointer hover:-translate-y-0.5 hover:ring-1 transition-all duration-300"
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          {years.map((year) => (
            <option key={year} value={year} className="text-green-800 text-xs">
              {year}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-row flex-wrap w-full items-center justify-start gap-2">
        {dashboardCardsDataBottom.map((card, index) => (
          <DashboardCard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
            isValueCurrency={card.isValueCurrency}
          />
        ))}
      </div>
      <div className="flex flex-col items-center p-4 justify-start rounded-2xl shadow-lg w-full min-w-80 min-h-80">
        <div className="flex flex-row items-center justify-start gap-3 w-full">
          <div className="flex flex-col items-start justify-start">
            <h2 className="text-md font-bold text-green-800">
              Revenues and Expenses
            </h2>
            <p className="text-xs text-gray-600">
              Insights and analytics of latest 3 years purchase requests history
            </p>
          </div>
        </div>
        <div className="w-full h-96">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={fundsTrend}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                {/* Green */}
                <linearGradient id="revenueColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#166534" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#dcfce7" stopOpacity={0} />
                </linearGradient>

                {/* Red */}
                <linearGradient id="expenseColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#991B1B" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#FEE2E2" stopOpacity={0} />
                </linearGradient>

                {/* THE FADE MASK */}
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
                type="linear"
                dataKey="expense"
                stroke="#991B1B"
                strokeWidth={1}
                fillOpacity={1}
                fill="url(#expenseColor)"
                mask="url(#fadeEdges)"
              />
              <Area
                type="linear"
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
      </div>
    </main>
  );
}
