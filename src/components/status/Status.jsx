export default function Status({ icon, description, color }) {
  switch (color) {
    case "green":
      color = "text-green-800 bg-green-800/20";
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
