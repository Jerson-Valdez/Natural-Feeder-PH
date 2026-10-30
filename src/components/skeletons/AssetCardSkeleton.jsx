export default function AssetCardSkeleton() {
  return (
    <div aria-hidden="true" className="min-h-72 animate-pulse rounded-2xl border border-gray-100 bg-white p-5 shadow-lg">
      <div className="flex justify-between gap-3"><div className="h-5 w-40 rounded bg-gray-200" /><div className="h-6 w-20 rounded bg-gray-200" /></div>
      <div className="mt-5 grid grid-cols-2 gap-4">{[1, 2, 3, 4].map((key) => <div key={key} className="space-y-2"><div className="h-3 w-16 rounded bg-gray-200" /><div className="h-4 w-24 rounded bg-gray-200" /></div>)}</div>
      <div className="mt-5 h-4 w-48 rounded bg-gray-200" />
      <div className="mt-5 flex gap-2 border-t border-gray-100 pt-3"><div className="h-9 w-24 rounded-lg bg-gray-200" /><div className="h-9 w-20 rounded-lg bg-gray-200" /><div className="ml-auto h-9 w-9 rounded-lg bg-gray-200" /></div>
    </div>
  );
}
