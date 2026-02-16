"use client";

import Link from "next/link";
import {FaShieldAlt} from "react-icons/fa";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-xl w-full bg-white border border-gray-200 rounded-xl shadow-sm p-8 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 flex items-center justify-center rounded-full bg-red-100 text-red-600">
            <FaShieldAlt size={36} />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900">
          Unauthorized Access
        </h1>

        {/* Message */}
        <p className="mt-4 text-neutral leading-relaxed">
          You have attempted to access a page that you are not authorized to
          view. This area is restricted based on your account role.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard"
            className="inline-flex justify-center items-center px-6 py-2.5 rounded-md bg-primary text-white font-medium hover:bg-primary/90 transition"
          >
            Go to Dashboard
          </Link>

          <Link
            href="/"
            className="inline-flex justify-center items-center px-6 py-2.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Back to Home
          </Link>
        </div>

        {/* Hint */}
        <p className="mt-6 text-xs text-gray-500">
          If you believe this is a mistake, please contact support or your
          administrator.
        </p>
      </div>
    </div>
  );
}
