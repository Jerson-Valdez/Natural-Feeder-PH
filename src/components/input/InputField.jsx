export default function InputField({
  label,
  type,
  placeholder,
  value,
  onChange,
  isDisabled,
  errorMessage,
  icon,
  isAutoComplete = false,
}) {
  return (
    <div className="flex flex-col items-start justify-center gap-1 w-full px-2">
      <label className="text-sm font-semibold text-gray-700" htmlFor={label}>
        {label}
      </label>

      <div
        className={`flex flex-row items-center justify-start gap-2 w-full px-4 py-2 rounded-lg border border-gray-200 transition-all duration-300 focus-within:outline-none focus-within:ring-1 focus-within:ring-green-800 focus-within:border-transparent ${
          isDisabled ? "bg-gray-200 cursor-not-allowed" : "bg-white"
        }`}
      >
        {icon && <span className="text-gray-400">{icon}</span>}

        <input
          id={label}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="flex-1 bg-transparent focus:outline-none text-gray-700 placeholder-gray-400 w-full"
          disabled={isDisabled}
          autoComplete={isAutoComplete ? "on" : "off"}
        />
      </div>

      {errorMessage && <p className="text-xs text-red-800">{errorMessage}</p>}
    </div>
  );
}
