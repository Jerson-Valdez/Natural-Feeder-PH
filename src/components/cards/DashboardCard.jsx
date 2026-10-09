export default function DashboardCard({ title, value, icon: Icon, color, isValueCurrency }) {
  let borderColor = color;
  switch (color) {
    case "blue":
      color = "bg-blue-100 text-blue-500 border-blue-500";
      break;
    case "green":
      color = "bg-green-100 text-green-500 border-green-500";
      break;
    case "red":
      color = "bg-red-100 text-red-500 border-red-500";
      break;
    case "yellow":
      color = "bg-yellow-100 text-yellow-500 border-yellow-500";
      break;
    default:
      color = "bg-gray-100 text-gray-500 border-gray-500";
  }

  switch (borderColor){
    case "blue":
      borderColor = "border-blue-500";
      break
    case "green":
      borderColor = "border-green-500";
      break
    case "red":
      borderColor = "border-red-500";
      break
    case "yellow":
      borderColor = "border-yellow-500";
      break
    default:
      borderColor = "border-gray-500";
  }

  return (
    <div className={`flex-1 flex flex-row w-1/3 items-start justify-between gap-2 text-center rounded-2xl p-4 shadow-lg border-b-2 ${borderColor} lg:min-w-2xs bg-white`}>
      <div className="flex flex-col items-start justify-center gap-1">
        <h2 className="text-start text-xs font-medium text-gray-500 uppercase">
          {title}
        </h2>
        <p className="text-base font-black">
          {isValueCurrency
            ? value.toLocaleString("en-PH", {
                style: "currency",
                currency: "PHP",
              })
            : value.toLocaleString("en-PH")}
        </p>
      </div>
      <div
        className={`flex flex-row items-center justify-center ${color} p-2 rounded-xl`}
      >
        <Icon size={18} />
      </div>
    </div>
  );
}
