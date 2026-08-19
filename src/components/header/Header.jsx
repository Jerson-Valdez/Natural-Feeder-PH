import { logo } from "../../assets/Logo.svg";
import { IconShoppingBag } from "@tabler/icons-react";

export default function Header({ basketCount = 0 }) {
  return (
    <header
      className="fixed top-4 left-1/2 z-51 px-4 flex h-12 w-[calc(100%-2rem)] max-w-7xl -translate-x-1/2 flex-row items-center justify-between rounded-full border-b border-white/20 bg-white/40 shadow-lg backdrop-blur-sm"
      data-aos="fade-down"
    >
      <div className="flex flex-row items-center gap-2">
        <img
          src={logo}
          alt="Natural Feeder PH"
          loading="eager"
          className="h-auto w-12"
        />
        <h1 className="text-lg font-black text-green-800">
          Natural Feeder <span className="text-amber-900">PH</span>
        </h1>
      </div>
      <div className="flex flex-row items-center gap-2 text-green-800 relative">
        <IconShoppingBag size={24} />
        {basketCount > 0 && (
          <span className="font-semibold text-xs absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center">
            {basketCount}
          </span>
        )}
      </div>
    </header>
  );
}
