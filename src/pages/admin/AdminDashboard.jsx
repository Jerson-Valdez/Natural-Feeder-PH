import {
  IconActivityHeartbeat,
  IconArchive,
  IconCalendarCancel,
  IconCashMinus,
  IconCashMove,
  IconClock,
  IconChartAreaLine,
  IconChartArrowsVertical,
  IconPercentage,
  IconTrendingUp,
  IconWallet,
} from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { toast } from "sonner";
import DashboardCard from "../../components/cards/DashboardCard";
import FundsTrendCard from "../../components/cards/FundsTrendCard";
import DashboardCardSkeleton from "../../components/skeletons/DashboardCardSkeleton";
import { db } from "../../config/firebase";

const monthOptions = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function toDate(value) {
  if (!value) return null;
  if (value?.toDate) return value.toDate();
  if (value instanceof Date)
    return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value === "number" || typeof value === "string") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  if (typeof value === "object" && Number.isFinite(value.seconds)) {
    return new Date(value.seconds * 1000);
  }
  return null;
}

function getOrderDate(order) {
  return toDate(order.createdAt ?? order.orderDate ?? order.date);
}

function getExpenseDate(expense) {
  return toDate(expense.expenseDate ?? expense.date ?? expense.createdAt);
}

function getExpenseAmount(expense) {
  const amount = Number(
    expense.amount ?? expense.total ?? expense.expenseAmount ?? 0,
  );
  return Number.isFinite(amount) ? amount : 0;
}

export default function AdminDashboard() {
  const today = new Date();
  const [orders, setOrders] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [selectedYear, setSelectedYear] = useState(String(today.getFullYear()));
  const [selectedMonth, setSelectedMonth] = useState(String(today.getMonth()));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCurrent = true;
    async function fetchDashboardData() {
      setIsLoading(true);
      try {
        const [ordersSnapshot, expensesSnapshot] = await Promise.all([
          getDocs(collection(db, "orders")),
          getDocs(collection(db, "expenses")),
        ]);
        if (!isCurrent) return;
        setOrders(
          ordersSnapshot.docs.map((snapshot) => ({
            id: snapshot.id,
            ...snapshot.data(),
          })),
        );
        setExpenses(
          expensesSnapshot.docs.map((snapshot) => ({
            id: snapshot.id,
            ...snapshot.data(),
          })),
        );
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to fetch dashboard data. Please try again later.");
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }
    fetchDashboardData();
    return () => {
      isCurrent = false;
    };
  }, []);

  const availableYears = useMemo(() => {
    const found = new Set([today.getFullYear()]);
    orders.forEach((order) => {
      const date = getOrderDate(order);
      if (date) found.add(date.getFullYear());
    });
    expenses.forEach((expense) => {
      const date = getExpenseDate(expense);
      if (date) found.add(date.getFullYear());
    });
    return [...found].sort((a, b) => b - a).map(String);
  }, [orders, expenses, today]);

  const selectedYearNumber = Number(selectedYear);
  const selectedMonthNumber = Number(selectedMonth);
  const yearOrders = orders.filter(
    (order) => getOrderDate(order)?.getFullYear() === selectedYearNumber,
  );
  const yearExpenses = expenses.filter(
    (expense) => getExpenseDate(expense)?.getFullYear() === selectedYearNumber,
  );
  const monthOrders = yearOrders.filter(
    (order) => getOrderDate(order)?.getMonth() === selectedMonthNumber,
  );
  const monthExpenses = yearExpenses.filter(
    (expense) => getExpenseDate(expense)?.getMonth() === selectedMonthNumber,
  );

  const revenueMonth = monthOrders.reduce(
    (sum, order) =>
      order.status === "completed"
        ? sum + (Number(order.totalPrice) || 0)
        : sum,
    0,
  );
  const expensesMonth = monthExpenses.reduce(
    (sum, expense) => sum + getExpenseAmount(expense),
    0,
  );
  const totalRevenue = yearOrders.reduce(
    (sum, order) =>
      order.status === "completed"
        ? sum + (Number(order.totalPrice) || 0)
        : sum,
    0,
  );
  const totalExpenses = yearExpenses.reduce(
    (sum, expense) => sum + getExpenseAmount(expense),
    0,
  );
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
  const fundsTrend = monthOptions.map((month, index) => ({
    month: month.slice(0, 3),
    expense: yearExpenses
      .filter((expense) => getExpenseDate(expense)?.getMonth() === index)
      .reduce((sum, expense) => sum + getExpenseAmount(expense), 0),
    revenue: yearOrders
      .filter(
        (order) =>
          order.status === "completed" &&
          getOrderDate(order)?.getMonth() === index,
      )
      .reduce((sum, order) => sum + (Number(order.totalPrice) || 0), 0),
  }));

  const activeOrders = orders.filter(
    (order) => order.status === "active",
  ).length;
  const pendingOrders = orders.filter((order) =>
    ["pending", "awaiting messenger chat"].includes(order.status),
  ).length;
  const cancelledOrders = orders.filter(
    (order) => order.status === "cancelled",
  ).length;
  const approvedOrders = orders.filter((order) =>
    ["active", "completed"].includes(order.status),
  ).length;
  const topCards = [
    {
      title: "Active Orders",
      value: activeOrders,
      icon: IconActivityHeartbeat,
      color: "green",
    },
    {
      title: "Pending Approval",
      value: pendingOrders,
      icon: IconClock,
      color: "yellow",
    },
    {
      title: "Cancelled Orders",
      value: cancelledOrders,
      icon: IconCalendarCancel,
      color: "red",
    },
    {
      title: "Approved Orders",
      value: approvedOrders,
      icon: IconArchive,
      color: "blue",
    },
  ];
  const financialCards = [
    {
      title: "Revenue (Month)",
      value: revenueMonth,
      icon: IconCashMove,
      color: "green",
      currency: true,
    },
    {
      title: "Expenses (Month)",
      value: expensesMonth,
      icon: IconCashMinus,
      color: "red",
      currency: true,
    },
    {
      title: "Revenue (Year)",
      value: totalRevenue,
      icon: IconChartArrowsVertical,
      color: "blue",
      currency: true,
    },
    {
      title: "Expenses (Year)",
      value: totalExpenses,
      icon: IconWallet,
      color: "yellow",
      currency: true,
    },
    {
      title: "Net Profit (Year)",
      value: netProfit,
      icon: IconTrendingUp,
      color: "green",
      currency: true,
    },
    {
      title: "Profit Margin (Year)",
      value: profitMargin,
      icon: IconPercentage,
      color: "green",
      percent: true,
    },
  ];

  return (
    <main className="page-container" aria-busy={isLoading}>
      <div className="flex w-full flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-green-800">Admin Dashboard</h1>
          <p className="text-sm text-gray-600">
            Manage your store and monitor your sales performance.
          </p>
        </div>
      </div>
      <div className="mt-2 flex w-full flex-row flex-wrap items-center justify-start gap-2">
        {isLoading ? (
          <div
            role="status"
            aria-label="Loading order totals"
            className="flex w-full flex-row flex-wrap gap-2"
          >
            {[1, 2, 3, 4].map((key) => (
              <DashboardCardSkeleton key={key} />
            ))}
          </div>
        ) : (
          topCards.map((card) => (
            <DashboardCard key={card.title} {...card} isValueCurrency={false} />
          ))
        )}
      </div>
      <section className="my-4 flex w-full flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <IconChartAreaLine size={24} className="text-green-800" />
            <h2 className="text-lg font-semibold text-green-800">
              Overview of Funds
            </h2>
          </div>
          <p className="text-sm text-gray-600">
            {monthOptions[selectedMonthNumber]} {selectedYear}
          </p>
        </div>
        <div className="flex gap-2">
          <label className="sr-only" htmlFor="dashboard-month">
            Month
          </label>
          <select
            id="dashboard-month"
            value={selectedMonth}
            onChange={(event) => setSelectedMonth(event.target.value)}
            className="rounded-2xl border border-gray-200 bg-white px-3 py-2 font-semibold text-green-800 shadow-md focus:outline-none focus:ring-2 focus:ring-green-800 hover:cursor-pointer hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300"
          >
            {monthOptions.map((month, index) => (
              <option key={month} value={index}>
                {month}
              </option>
            ))}
          </select>
          <label className="sr-only" htmlFor="dashboard-year">
            Year
          </label>
          <select
            id="dashboard-year"
            value={selectedYear}
            onChange={(event) => setSelectedYear(event.target.value)}
            className="rounded-2xl border border-gray-200 bg-white px-3 py-2 font-semibold text-green-800 shadow-md focus:outline-none focus:ring-2 focus:ring-green-800 hover:cursor-pointer hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300"
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </section>
      <div className="flex w-full flex-row flex-wrap items-center justify-start gap-2">
        {isLoading ? (
          <div
            role="status"
            aria-label="Loading financial totals"
            className="flex w-full flex-row flex-wrap gap-2"
          >
            {[1, 2, 3, 4, 5, 6].map((key) => (
              <DashboardCardSkeleton key={key} />
            ))}
          </div>
        ) : (
          financialCards.map((card) => (
            <DashboardCard
              key={card.title}
              title={card.title}
              value={card.percent ? `${card.value.toFixed(1)}%` : card.value}
              icon={card.icon}
              color={card.color}
              isValueCurrency={card.currency}
            />
          ))
        )}
      </div>
      <FundsTrendCard
        data={fundsTrend}
        year={selectedYear}
        isLoading={isLoading}
      />
    </main>
  );
}
