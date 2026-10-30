export default function InventoryProductCardSkeleton() {
  return (
    <div aria-hidden="true" className="min-h-80 animate-pulse overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg">
      <div className="h-40 bg-gray-200" />
      <div className="flex min-h-40 flex-col p-4">
        <div className="h-4 w-36 rounded bg-gray-200" />
        <div className="mt-2 h-3 w-full rounded bg-gray-200" />
        <div className="mt-1 h-3 w-3/4 rounded bg-gray-200" />
        <div className="mt-4 h-3 w-14 rounded bg-gray-200" />
        <div className="mt-2 flex gap-2"><div className="h-7 w-28 rounded-lg bg-gray-200" /><div className="h-7 w-32 rounded-lg bg-gray-200" /></div>
        <div className="mt-auto flex gap-2 border-t border-gray-100 pt-3"><div className="h-9 w-20 rounded-lg bg-gray-200" /><div className="ml-auto h-9 w-9 rounded-lg bg-gray-200" /></div>
      </div>
    </div>
  );
}
