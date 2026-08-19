import { Link } from "react-router-dom";
import {
  IconArchiveFilled,
  IconProgressHelp,
  IconBug,
  IconCircleFilled,
} from "@tabler/icons-react";
import hero from "../../assets/landing page assets/hero_img.jpg";
import Status from "../../components/status/Status";
import PrimaryButtonLink from "../../components/buttons/PrimaryButtonLink";
import SecondaryButtonLink from "../../components/buttons/SecondaryButtonLink";

export default function Hero() {
  return (
    <section
      id="hero"
      className="w-full flex flex-col flex-col-reverse justify-center items-center gap-4 py-20 min-md:flex-row"
      data-aos="fade-right"
    >
      <div className="flex flex-col gap-2 justify-center items-center w-full min-sm:justify-start min-sm:items-start min-sm:w-1/2">
        <Status
          icon={<IconBug size={24} />}
          description="Paombong, Bulacan · Premium feeder insects"
          color="green"
        />
        <h1 className="text-5xl font-black text-center text-green-800">
          Fresh Feeders,
        </h1>
        <h1 className="text-5xl font-black text-center text-amber-900">
          Straight to You
        </h1>
        <p className="text-base text-amber-900">
          <strong>Welcome to Natural Feeder PH.</strong> Order superworms from
          Paombong, Bulacan. — browse today's prices, add to your basket, and
          send your order directly on Messenger.
        </p>
        <div className="flex flex-row gap-2">
          <PrimaryButtonLink
            to="/order-now"
            icon={<IconArchiveFilled size={20} />}
            text="Order Now"
          />
          <SecondaryButtonLink
            to="/#how-it-works"
            icon={<IconProgressHelp size={20} />}
            text="How It Works"
            isHash={true}
          />
        </div>
        <div className="flex flex-row flex-wrap gap-2 justify-center min-sm:justify-start">
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
      <img
        src={hero}
        alt="Hero image"
        className="w-full rounded-xl min-md:w-1/2"
      />
    </section>
  );
}
