export default function AdminOrderCardSkeleton() {
  return (
    <article aria-hidden="true" className="w-full animate-pulse rounded-2xl border border-gray-100 bg-white p-4 shadow-lg">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <div className="h-4 w-40 rounded bg-gray-200" />
          <div className="h-3 w-52 max-w-full rounded bg-gray-200" />
          <div className="h-3 w-64 max-w-full rounded bg-gray-200" />
          <div className="h-3 w-32 rounded bg-gray-200" />
        </div>
        <div className="h-8 w-32 rounded-full bg-gray-200" />
      </div>
      <div className="mt-4 border-t border-gray-100 pt-4">
        <div className="mb-2 h-3 w-12 rounded bg-gray-200" />
        <div className="h-3 w-48 max-w-full rounded bg-gray-200" />
        <div className="ml-auto mt-3 h-5 w-24 rounded bg-gray-200" />
      </div>
    </article>
  );
}
