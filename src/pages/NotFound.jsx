import notFoundImage from "../assets/notfound/notFound.jpg";
import { Link } from "react-router-dom";

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
        <Link to="/" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-green-800 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-800 focus-visible:ring-offset-2">
          <IconHomeFilled size={24} /> Go Back Home
        </Link>
      </div>
    </main>
  );
}
