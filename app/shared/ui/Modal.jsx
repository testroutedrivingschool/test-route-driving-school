"use client";

import React, { useRef } from "react";

export default function Modal({ children, onClose, className }) {
  const modalRef = useRef(null);

  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  return (
    <div
      onMouseDown={handleOverlayClick}
      className="fixed inset-0 z-999999 flex items-center justify-center bg-black/50 px-3"
    >
      <div
        ref={modalRef}
        className={`
          bg-white rounded-xl shadow-lg
          w-full max-w-3xl
          max-h-[90vh]
          overflow-y-auto
          p-4
          relative
          ${className || ""}
        `}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 flex justify-end">
          <button
            onClick={onClose}
            className="
              w-7 h-7
              flex items-center justify-center
              rounded-full
              bg-gray-100
              text-gray-600
              hover:bg-red-500 hover:text-white
              transition-all duration-200
              shadow-sm
              hover:shadow-md
            "
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="pt-1">{children}</div>
      </div>
    </div>
  );
}