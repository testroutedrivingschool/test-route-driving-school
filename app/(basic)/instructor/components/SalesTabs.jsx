"use client";

import Container from "@/app/shared/ui/Container";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaChevronDown } from "react-icons/fa";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

const tabs = [
  { label: "Search", href: "/instructor/sales/search" },
  { label: "Sales", href: "/instructor/sales/sales" },
  { label: "Web Sales", href: "/instructor/sales/web-sales" },
  {
    label: "New",
    dropdown: [{ label: "Booking", href: "/instructor-booking" }],
  },
];

export default function SalesTabs() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const btnRef = useRef(null);
  const menuRef = useRef(null);
  const closeTimerRef = useRef(null);

  const [pos, setPos] = useState({ top: 0, left: 0 });

  const isActiveTab = (href) =>
    pathname === href || pathname.startsWith(href + "/");

  const dropdownTab = useMemo(() => tabs.find((t) => t.dropdown), []);

  const computePos = () => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    setPos({
      top: rect.bottom + window.scrollY + 8,
      left: rect.right + window.scrollX,
    });
  };

  const openMenu = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    computePos();
    setOpen(true);
  };

  const closeMenuWithDelay = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => setOpen(false), 150);
  };

  // close on outside click + Escape
  useEffect(() => {
    const onDown = (e) => {
      const btn = btnRef.current;
      const menu = menuRef.current;

      if (!open) return;
      if (btn?.contains(e.target)) return;
      if (menu?.contains(e.target)) return;

      setOpen(false);
    };

    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // reposition on resize/scroll while open
  useEffect(() => {
    if (!open) return;

    const update = () => computePos();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open]);

  // cleanup timer
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  return (
    <div className="sticky top-0 z-40 bg-white border-b border-border-color mt-5">
      <Container>
        <div className="flex items-center gap-2 px-6 overflow-x-auto scrollbar-hide">
          {tabs.map((tab, i) => {
            if (tab.dropdown) {
              return (
                <button
                  key={`dropdown-${i}`}
                  ref={btnRef}
                  type="button"
                  onMouseEnter={openMenu}
                  onMouseLeave={closeMenuWithDelay}
                  className="px-4 py-3 text-sm font-semibold bg-gray-50 whitespace-nowrap rounded-t-md text-primary hover:bg-gray-50 flex items-center gap-2"
                >
                  {tab.label} <FaChevronDown className="text-xs" />
                </button>
              );
            }

            const active = isActiveTab(tab.href);

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap rounded-t-md
                  ${
                    active
                      ? "bg-primary text-white border border-b-0"
                      : "text-primary bg-gray-50"
                  }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </Container>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            onMouseEnter={openMenu}
            onMouseLeave={closeMenuWithDelay}
            className="fixed z-999 w-44 rounded border border-border-color bg-white shadow-lg overflow-hidden"
            style={{
              top: pos.top,
              left: pos.left,
              transform: "translateX(-100%)",
            }}
          >
            {dropdownTab.dropdown.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-2 text-sm hover:bg-gray-50"
              >
                {item.label}
              </Link>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
}
