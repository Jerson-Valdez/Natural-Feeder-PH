export default function InputField({ label, type, placeholder, value, onChange, isDisabled, errorMessage }) {
  return (
    <div className="flex flex-col items-start justify-center gap-1 w-full px-2">
        <label className="text-sm font-semibold text-gray-700" htmlFor={label}>
            {label}
        </label>
        <input
            id={label}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-green-800 focus:border-transparent transition-all duration-300 ${
                isDisabled ? "bg-gray-200 cursor-not-allowed" : "bg-white"
            }`}
            disabled={isDisabled}
        />
        <p className="text-xs text-red-800">{errorMessage}</p>
    </div>
  );
}