export default function OrderHistoryCardSkeleton() {
  return (
    <div className="flex flex-col gap-2 w-full rounded-2xl p-3 shadow-md border cursor-pointer hover:shadow-lg hover:-translate-y-0.5 bg-white/80 border-white/40 transition-all duration-300 animate-pulse">
      <div className="flex flex-row items-center justify-between">
        <div>
          <div className="h-5 bg-gray-300 rounded w-52 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-300 rounded w-34 animate-pulse"></div>
        </div>
        <div>
          <div className="h-5 bg-gray-300 rounded w-16 animate-pulse"></div>
        </div>
      </div>
      <div>
        <div className="flex flex-row justify-between items-center gap-2 p-2">
          <div className="h-5 bg-gray-300 rounded w-xs animate-pulse"></div>
          <div className="h-5 bg-gray-300 rounded w-16 animate-pulse"></div>
        </div>
        <div className="flex flex-row justify-between items-center gap-2 p-2">
          <div className="h-5 bg-gray-300 rounded w-md animate-pulse"></div>
          <div className="h-5 bg-gray-300 rounded w-16 animate-pulse"></div>
        </div>
        <hr className="border-gray-300" />
        <div className="flex flex-row flex-wrap items-center justify-start w-full rounded-2xl p-2 gap-5">
          <div className="flex flex-row items-center gap-2">
            <div className="h-5 bg-gray-300 rounded w-28 animate-pulse"></div>
          </div>
          <div className="flex flex-row items-center gap-2">
            <div className="h-5 bg-gray-300 rounded w-28 animate-pulse"></div>
          </div>
          <div className="flex flex-row items-center gap-2">
            <div className="h-5 bg-gray-300 rounded w-28 animate-pulse"></div>
          </div>
          <div className="flex flex-row items-center gap-2">
            <div className="h-5 bg-gray-300 rounded w-28 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
