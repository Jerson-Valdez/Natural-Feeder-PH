import { OrbitProgress } from "react-loading-indicators";

export default function PrimaryButton({
  icon,
  text,
  action,
  isDisabled,
  isLoading,
  loadingText = "Loading...",
}) {
  return (
    <button
      onClick={action}
      className="flex flex-row w-full items-center justify-center gap-2 bg-green-800 text-white px-4 py-2 rounded-full font-medium hover:bg-green-900 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 active:scale-95 cursor-pointer 
      disabled:cursor-not-allowed disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:hover:shadow-none disabled:hover:-translate-y-0 disabled:active:scale-100"
      disabled={isDisabled}
    >
      <div className={`flex items-center justify-center gap-2 transition-opacity ${isLoading ? "invisible opacity-0" : "visible opacity-100"}`}>
        {icon}
        <span>{text}</span>
      </div>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
           <div className="scale-50 flex items-center justify-center">
             <OrbitProgress color="#ffffff" size="small" />
           </div>
           <span className="ml-2 text-white">{loadingText}</span>
        </div>
      )}
    </button>
  );
}
