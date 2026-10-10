import notFoundImage from "../assets/notfound/notFound.jpg";
import PrimaryButtonLink from "../components/buttons/PrimaryButtonLink";

import { IconHomeFilled } from "@tabler/icons-react";

export default function NotFound() {
  return (
    <main className="page-container not-found-page">
      <h1 className="z-50 text-center text-2xl lg:text-5xl font-bold text-green-800">
        404 - Page Not Found
      </h1>
      <p className="z-50 text-center text-sm lg:text-2xl text-gray-600">
        The page you are looking for does not exist.
      </p>

      <img src={notFoundImage} alt="Not Found" className="w-6xl lg:-mt-20" />
      <div className="flex flex-col items-center justify-center lg:-mt-10">
        <PrimaryButtonLink
          text="Go Back Home"
          to="/"
          icon={<IconHomeFilled size={24} className="text-white" />}
        />
      </div>
    </main>
  );
}
