import { Link } from "react-router-dom";

export default function PrimaryButtonLink({ to, icon, text }) {
  return (
    <Link
      to={to}
      className="flex flex-row items-center justify-center gap-2 bg-green-800 text-white px-4 py-2 rounded-full font-medium hover:bg-green-900 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
    >
      {icon ? icon : null}
      {text}
    </Link>
  );
}
