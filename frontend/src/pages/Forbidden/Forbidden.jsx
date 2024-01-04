// Neccessary imports

import { Link } from "react-router-dom";

export const Forbidden = () => {
  return (
    <>
      <main className="grid min-h-screen place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-base font-semibold text-indigo-600">403</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Forbidden
          </h1>
          <p className="mt-6 text-base leading-7 text-gray-600">
            Sorry, access to the page you're looking for is forbidden. You do
            not have the required permissions to access this resource.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/"
              className="rounded-md bg-primaryColor px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Go back home
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};