"use client";

import React from "react";

export default function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-999 flex items-end sm:items-center justify-center bg-black/50 px-3">
      <div
        className="
          bg-white rounded-t-2xl sm:rounded-xl shadow-lg
          w-full max-w-xl
          max-h-[90vh]
          overflow-y-auto
          p-5 sm:p-6
          relative
        "
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 font-bold text-2xl"
        >
          &times;
        </button>

        {/* Content */}
        <div className="pt-6">{children}</div>
      </div>
    </div>
  );
}
