export default function CatalogSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl gap-2 shadow-xl animate-pulse">
      <div className="w-full h-52 rounded-t-2xl bg-gray-200 animate-pulse"></div>
      <div className="flex flex-col w-full p-5 gap-2 animate-pulse">
        <div className="w-32 h-5 bg-gray-300 rounded-md animate-pulse"></div>
        <div className="w-62 h-3 bg-gray-300 rounded-md animate-pulse"></div>
        <div className="w-48 h-3 bg-gray-300 rounded-md animate-pulse"></div>
        <div className="flex flex-row item-center justify-center w-full gap-2">
            <div className="w-26 h-12 md:w-25 md:h-16 bg-gray-300 rounded-md animate-pulse"></div>
            <div className="w-26 h-12 md:w-25 md:h-16 bg-gray-300 rounded-md animate-pulse"></div>
            <div className="w-26 h-12 md:w-25 md:h-16 bg-gray-300 rounded-md animate-pulse"></div>
        </div>
        <div className="flex flex-col w-full pt-6 gap-2">
            <div className="flex flex-row w-full items-center justify-between">
                <div className="w-12 h-5 bg-gray-300 rounded-md animate-pulse"></div>
                <div className="w-12 h-5 bg-gray-300 rounded-md animate-pulse"></div>
            </div>
            <div className="flex flex-row w-full items-center justify-evenly gap-2">
                <div className="w-34 h-12 bg-gray-300 rounded-md animate-pulse"></div>
                <div className="w-14 h-10 bg-gray-300 rounded-full animate-pulse"></div>
                <div className="w-32 h-10 bg-gray-300 rounded-full animate-pulse"></div>
            </div>
        </div>
      </div>
    </div>
  );
}
