import {
  IconHomeFilled,
  IconArchiveFilled,
  IconClipboardListFilled,
  IconBrandFacebookFilled,
} from "@tabler/icons-react";
import { NavLink } from "react-router-dom";

export default function Nav() {
  const navLink = [
    { name: "Home", to: "/", icon: <IconHomeFilled size={24} /> },
    {
      name: "Order Now",
      to: "/order-now",
      icon: <IconArchiveFilled size={24} />,
    },
    {
      name: "Order History",
      to: "/order-history",
      icon: <IconClipboardListFilled size={24} />,
    },
  ];

  return (
    <nav
      className="fixed bottom-3 left-1/2 z-50 flex h-16 w-[calc(100%-2rem)] max-w-5xl -translate-x-1/2 flex-row items-center justify-between rounded-full bg-white/40 px-2 shadow-lg backdrop-blur-sm transition-all duration-300
            lg:bottom-0 lg:-left-1 lg:top-0 lg:h-screen lg:w-24 lg:-translate-x-0 lg:flex-col lg:justify-start lg:py-18 lg:gap-2 lg:bg-green-800 lg:rounded-none lg:rounded-r-4xl lg:px-0 lg:shadow-2xl"
    >
      {navLink.map((link, index) => (
        <NavLink
          key={index}
          to={link.to}
          className={({ isActive }) =>
            `flex flex-row lg:flex-col items-center justify-center gap-1 rounded-full transition-all duration-300 ${
              isActive
                ? "bg-green-800 text-white flex-auto h-12 px-5 lg:flex-none lg:w-full lg:h-auto lg:py-4 lg:px-2 lg:bg-white lg:text-green-800 lg:rounded-l-none"
                : "text-green-800 flex-1 h-12 hover:bg-green-800/20 lg:flex-none lg:w-14 lg:h-14 lg:text-white"
            }`
          }
        >
          {({ isActive }) => (
            <>
              {link.icon}
              <span
                className={`text-xs text-center font-semibold overflow-hidden whitespace-nowrap ${
                  isActive ? "block" : "hidden"
                }`}
              >
                {link.name}
              </span>
            </>
          )}
        </NavLink>
      ))}

      <div className="hidden lg:flex flex-col text-white items-center gap-2 mt-auto">
        <p className="text-sm font-semibold tracking-wide">Visit Us</p>
        <a
          href="https://www.facebook.com/NaturalFeederPH"
          target="_blank"
          rel="noreferrer"
          className="flex flex-row border border-white shadow-lg p-3 rounded-2xl hover:bg-white hover:text-blue-800 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
        >
          <IconBrandFacebookFilled size={24} />
        </a>
      </div>
    </nav>
  );
}
