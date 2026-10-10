import {
  IconHomeFilled,
  IconArchiveFilled,
  IconClipboardListFilled,
  IconBrandFacebookFilled,
  IconChartDotsFilled,
  IconListDetailsFilled,
  IconIconsFilled,
  IconDoorExit,
} from "@tabler/icons-react";
import { NavLink } from "react-router-dom";

//toast
import { toast } from "sonner";

//auth
import { auth } from "../../config/firebase";
import { signOut } from "firebase/auth";

const navLinks = [
  { name: "Home", to: "/", icon: IconHomeFilled },
  { name: "Order Now", to: "/order-now", icon: IconArchiveFilled },
  {
    name: "Order History",
    to: "/order-history",
    icon: IconClipboardListFilled,
  },
];

const adminNavLinks = [
  { name: "Dashboard", to: "/admin/dashboard", icon: IconChartDotsFilled },
  { name: "Orders", to: "/admin/orders", icon: IconListDetailsFilled },
  { name: "Assets", to: "/admin/assets", icon: IconIconsFilled },
];

async function handleLogout(setUserRole, setUser) {
  try {
    await signOut(auth);
    setUserRole("user");
    setUser(null);
    toast.success("Logout successful!", {
      description: "You have been logged out successfully.",
    });
  } catch (error) {
    console.error("Error signing out:", error);
  }
}

export default function Nav({ userRole, setUserRole, setUser }) {
  return (
    <nav
      className="
        fixed bottom-3 left-1/2 z-50
        flex h-16 w-[calc(100%-2rem)] max-w-md
        -translate-x-1/2 items-center gap-1
        rounded-full bg-white/40 p-2 shadow-lg
        backdrop-blur-sm

        lg:bottom-auto lg:left-4 lg:top-1/2
        lg:h-[90vh] lg:w-18
        lg:-translate-y-1/2 lg:translate-x-0
        lg:flex-col lg:justify-start lg:gap-2
        lg:bg-green-800
        lg:rounded-full
        lg:px-2 lg:py-8
      "
    >
      <div className="flex w-full items-center justify-between gap-1 lg:flex-col lg:justify-start lg:gap-2">
        {(userRole === "admin" ? adminNavLinks : navLinks).map(
          ({ name, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `
                group relative flex h-12 min-w-0 items-center
                justify-center gap-2 rounded-full
                transition-colors duration-200

                lg:h-12 lg:w-full lg:flex-none lg:gap-0
                lg:rounded-2xl

                ${
                  isActive
                    ? "flex-[1.5] bg-green-800 px-3 text-white lg:text-green-800 lg:bg-white"
                    : "flex-1 px-1 text-neutral-600 hover:bg-green-50 lg:px-0 lg:text-neutral-300 lg:hover:bg-green-900 lg:hover:text-white"
                }
              `
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={24} className="shrink-0" aria-hidden="true" />

                  <span
                    className={`
                    min-w-0 truncate text-xs font-semibold
                    ${isActive ? "block" : "hidden"}
                    lg:hidden
                  `}
                  >
                    {name}
                  </span>

                  <div
                    className="
                    pointer-events-none absolute
                    left-[calc(100%+12px)] top-1/2
                    z-[100] hidden -translate-y-1/2
                    whitespace-nowrap rounded-2xl
                    bg-green-900 px-5 py-3.5
                    text-sm font-medium text-white
                    shadow-xl

                    lg:block lg:invisible lg:opacity-0
                    lg:translate-x-1
                    lg:transition-all lg:duration-200
                    lg:group-hover:visible
                    lg:group-hover:translate-x-0
                    lg:group-hover:opacity-100
                  "
                  >
                    {name}
                  </div>
                </>
              )}
            </NavLink>
          ),
        )}
      </div>

      {userRole === "admin" ? (
        <div className="mt-auto hidden w-full flex-col items-center gap-3 lg:flex">
          <button
            aria-label="Logout"
            title="Logout"
            className="
            flex h-12 w-full items-center justify-center
            rounded-2xl text-white
            hover:bg-red-800
            hover:-translate-y-0.5
            transition-all duration-300
            cursor-pointer
          "
            onClick={() => handleLogout(setUserRole, setUser)}
          >
            <IconDoorExit size={24} />
          </button>
        </div>
      ) : (
        <div className="mt-auto hidden w-full flex-col items-center gap-3 lg:flex">
          <a
            href="https://www.facebook.com/NaturalFeederPH"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit us on Facebook"
            className="
            flex h-12 w-full items-center justify-center
            rounded-2xl text-white
            transition-colors hover:bg-blue-600
            hover:text-white
          "
          >
            <IconBrandFacebookFilled size={24} />
          </a>

          <span className="text-[10px] font-medium text-white">Visit Us</span>
        </div>
      )}
    </nav>
  );
}
