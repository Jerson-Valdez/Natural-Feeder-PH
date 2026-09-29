export default function RadioField({
  label,
  radios,
  selectedValue,
  setSelectedValue,
}) {
  return (
    <div className="flex flex-col items-start justify-center w-full gap-2 px-2">
      <label className="text-sm font-semibold text-gray-700">
        {label}
      </label>
      <div className="flex flex-row items-center justify-start w-full gap-2">
        {radios.map((radio, index) => {
          return (
            <label
              htmlFor={radio.label}
              key={index}
              className={`relative flex flex-1 flex-row items-center justify-between p-2 rounded-xl border cursor-pointer transition-all ${
                radio.value === selectedValue
                  ? "border-green-800 bg-green-50 ring-1 ring-green-800"
                  : "border-gray-200 bg-white hover:border-green-800/40 hover:bg-gray-50"
              }`}
            >
              <input
              id={radio.label}
                type="radio"
                name={radio.label}
                value={radio.value}
                className="hidden"
                checked={radio.value === selectedValue}
                onChange={() => setSelectedValue(radio.value)}
              />
              <div className="flex flex-col">
                <span
                  className={`font-bold text-[10px] md:text-xs ${radio.value === selectedValue ? "text-green-900" : "text-gray-700"}`}
                >
                  {radio.label}
                </span>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
