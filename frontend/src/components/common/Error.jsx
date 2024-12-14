import React from 'react';
import { Link } from 'react-router-dom';

const Error = ({message}) => {
  return (
    <main className="flex items-center justify-center h-screen bg-gray-100 text-center">
      <div className="py-10 px-4 sm:px-6 lg:px-8">
      <img
          src="https://res.cloudinary.com/dl61xv85e/image/upload/v1734204377/Cloudinary-React/hpf78atjhxrvhdufjykb.svg"
          alt="Error illustration"
          className="w-40 h-40 mx-auto sm:w-48 sm:h-48 lg:w-56 lg:h-56 object-contain"
        />
        <p className="mt-3 text-gray-600 dark:text-neutral-400">Oops, something went wrong.</p>
      
        <p className="text-gray-600 dark:text-neutral-400 font-bold">{message}</p>
        <div className="mt-5 flex flex-col justify-center items-center gap-2 sm:flex-row sm:gap-3">
          <Link
            to='/'
            className="w-full sm:w-auto py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
          >
            <svg
              className="shrink-0 size-4"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}

export default Error;
