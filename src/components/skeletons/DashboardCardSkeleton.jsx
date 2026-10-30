export default function DashboardCardSkeleton() {
  return (
    <div aria-hidden="true" className="flex min-h-20 flex-1 animate-pulse items-start justify-between gap-3 rounded-2xl bg-white p-4 shadow-lg lg:min-w-2xs">
      <div className="space-y-2"><div className="h-3 w-28 rounded bg-gray-200" /><div className="h-6 w-20 rounded bg-gray-200" /></div>
      <div className="h-10 w-10 rounded-xl bg-gray-200" />
    </div>
  );
}
