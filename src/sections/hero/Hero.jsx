import {
  IconArchiveFilled,
  IconProgressHelp,
  IconBug,
  IconCircleFilled,
} from "@tabler/icons-react";
import hero from "../../assets/landing page assets/hero_vid.mp4";
import Status from "../../components/status/Status";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";

export default function Hero() {
  return (
    <section
      id="hero"
      className="w-full flex flex-col flex-col-reverse justify-center items-center gap-4 py-20 sm:px-10 min-md:flex-row bg-white rounded-2xl"
      data-aos="fade-right"
    >
      <div className="flex flex-col gap-2 justify-center items-center w-full min-sm:justify-start min-sm:items-start min-sm:w-1/2">
        <Status
          icon={<IconBug size={24} />}
          description="Paombong, Bulacan · Premium feeder insects"
          color="green"
        />
        <h1 className="text-4xl font-black text-center text-green-800 lg:text-6xl">
          Fresh Feeders,
        </h1>
        <h1 className="text-4xl font-black text-center text-amber-900 lg:text-6xl">
          Straight to You
        </h1>
        <p className="text-base text-amber-900 text-center lg:text-left lg:text-lg">
          <strong>Welcome to Natural Feeder PH.</strong> Order superworms from
          Paombong, Bulacan. — browse today's prices, add to your basket, and
          send your order directly on Messenger.
        </p>
        <div className="flex flex-row gap-2 py-4">
          <Link to="/order-now" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-green-800 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-800 focus-visible:ring-offset-2">
            <IconArchiveFilled size={20} /> Order Now
          </Link>
          <HashLink smooth to="/#how-it-works" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-amber-900 px-5 py-2.5 text-sm font-semibold text-amber-900 transition-colors hover:bg-amber-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-900 focus-visible:ring-offset-2">
            <IconProgressHelp size={20} /> How It Works
          </HashLink>
        </div>
        <div className="flex flex-row flex-wrap gap-4 justify-center">
          <div className="flex flex-row items-center gap-2 text-green-800 text-xs font-semibold">
            <IconCircleFilled size={8} />
            Farm-fresh stock
          </div>
          <div className="flex flex-row items-center gap-2 text-green-800 text-xs font-semibold">
            <IconCircleFilled size={8} />
            Instant Messenger ordering
          </div>
          <div className="flex flex-row items-center gap-2 text-green-800 text-xs font-semibold">
            <IconCircleFilled size={8} />
            Local delivery
          </div>
        </div>
      </div>
      {/* <img
        src={hero}
        alt="Hero image"
        className="w-full rounded-xl min-md:w-1/2"
      /> */}
      <video
        src={hero}
        autoPlay
        loop
        muted
        playsInline
        className="w-full rounded-xl min-md:w-1/2 outline-none border-none"
      />
    </section>
  );
}
