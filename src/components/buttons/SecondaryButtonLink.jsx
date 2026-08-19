import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";

export default function SecondaryButtonLink({ to, icon, text, isHash }) {
  return isHash ? (
    <HashLink
      smooth
      to={to}
      className="flex flex-row items-center justify-center gap-2 border-2 border-amber-900 bg-transparent text-amber-900 px-4 py-2 rounded-full font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
    >
      {icon ? icon : null}
      {text}
    </HashLink>
  ) : (
    <Link
      to={to}
      className="flex flex-row items-center justify-center gap-2 border-2 border-amber-900 bg-transparent text-amber-900 px-4 py-2 rounded-full font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
    >
      {icon ? icon : null}
      {text}
    </Link>
  );
}
