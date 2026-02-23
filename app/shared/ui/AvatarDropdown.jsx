
"use client";

import {useEffect, useLayoutEffect, useRef, useState} from "react";
import Link from "next/link";
import {MdDashboard} from "react-icons/md";
import {FaSignOutAlt} from "react-icons/fa";
import { createPortal } from "react-dom";

export default function AvatarDropdown({
  open,
  onClose,
  anchorRef,
  dashHref,
  user,
  onLogout,
}) {
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState({top: 0, left: 0, width: 0});
  const menuRef = useRef(null);

  useEffect(() => setMounted(true), []);

  // Position under avatar
  const updatePosition = () => {
    const el = anchorRef?.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({
      top: r.bottom + 12,           // 12px gap
      left: r.right - 224,          // 224px = w-56
      width: r.width,
    });
  };

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (menuRef.current?.contains(e.target)) return;
      if (anchorRef.current?.contains(e.target)) return;
      onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose, anchorRef]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      ref={menuRef}
      style={{top: pos.top, left: pos.left}}
      className="fixed z-99999 right-0 top-6 w-56 rounded-2xl bg-white shadow-xl border border-border-color"
    >
      <div className="px-4 py-3 border-b border-border-color">
        <p className="font-semibold text-gray-900 truncate">{user?.name || "User"}</p>
        <p className="text-sm text-gray-500 truncate">{user?.email}</p>
      </div>

      <ul className="py-2">
        <li>
          <Link
            href={dashHref}
            className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-primary/10 transition"
            onClick={onClose}
          >
            <MdDashboard className="text-primary" />
            Dashboard
          </Link>
        </li>
      </ul>

      <div className="border-t border-border-color">
        <button
          onClick={() => {
            onLogout?.();
            onClose();
          }}
          className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </div>,
    document.body
  );
}