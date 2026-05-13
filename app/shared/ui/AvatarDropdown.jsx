import {useEffect, useLayoutEffect, useRef, useState} from "react";
import Link from "next/link";
import {FaSignOutAlt} from "react-icons/fa";
import {createPortal} from "react-dom";

export default function AvatarDropdown({
  open,
  onClose,
  anchorRef,
  user,
  onLogout,
  finalNavLinks = [],
  dropdownLinks = [],
}) {
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState({top: 0, left: 0});
  const menuRef = useRef(null);

  useEffect(() => setMounted(true), []);

  const updatePosition = () => {
    const el = anchorRef?.current;
    if (!el) return;

    const r = el.getBoundingClientRect();

    setPos({
      top: r.bottom + 12,
      left: Math.max(12, r.right - 224),
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
  }, [open]);

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

  const linksToShow =
    user?.role === "instructor" ? finalNavLinks : dropdownLinks;

  return createPortal(
    <div
      ref={menuRef}
      style={{top: pos.top, left: pos.left}}
      className="fixed z-99999 w-56 rounded-2xl bg-white shadow-xl border border-border-color overflow-hidden"
    >
      <div className="px-4 py-3 border-b border-border-color">
        <p className="font-semibold text-gray-900 truncate">
          {user?.name || "User"}
        </p>
        <p className="text-sm text-gray-500 truncate">{user?.email}</p>
      </div>

      <ul className="py-2 max-h-[70vh] overflow-y-auto">
        {linksToShow.map((item) => (
          <li key={item.id}>
            <Link
              href={item.pathname || "/"}
              className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-primary/10 hover:text-primary transition"
              onClick={onClose}
            >
              {item.label}
            </Link>
          </li>
        ))}
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
    document.body,
  );
}