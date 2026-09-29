export default function Status({ icon, description, color }) {
  switch (color) {
    case "green":
      color = "text-green-800 bg-green-800/20";
      break;
    case "yellow":
      color = "text-yellow-500 bg-yellow-500/20";
      break;
    case "red":
      color = "text-red-800 bg-red-800/20";
      break;
    case "blue":
      color = "text-blue-800 bg-blue-800/20";
      break;
    default:
      color = "text-black bg-black/20";
      break;
  }

  return (
    <div
      className={`flex flex-row items-center gap-2 px-3 py-1 rounded-full ${color}`}
    >
      {icon && (
        <div className="flex flex-row items-center justify-center w-6 h-6 rounded-full bg-white/20">
          {icon}
        </div>
      )}
      <p className="text-xs font-semibold">{description}</p>
    </div>
  );
}
