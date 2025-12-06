"use client";

import {useState, useEffect} from "react";
import Link from "next/link";
import Image from "next/image";
import {FiMenu, FiX, FiChevronRight} from "react-icons/fi";
import {FaAngleRight} from "react-icons/fa";
import {MdKeyboardArrowDown} from "react-icons/md";
import Container from "./Container";
import PrimaryBtn from "../Buttons/PrimaryBtn";

const navLinksLeft = [
  {id: 1, label: "Home", pathname: "/"},
  {id: 2, label: "About", pathname: "/about"},
  {id: 3, label: "Instructors", pathname: "/instructors"},
  {id: 4, label: "Services", pathname: "/services"},
];

const navLinksRight = [
  {id: 4, label: "Resources", pathname: "/resources"},
  {id: 5, label: "Package", pathname: "/package"},
  {
    id: 6,
    label: "Company",

    dropdowns: [
      {id: 1, label: "Blog", pathname: "/blog"},
      {id: 2, label: "Gallery", pathname: "/gallery"},
      {id: 3, label: "Testimonials", pathname: "/testimonials"},
    ],
  },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("/");


  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-500 ease-out bg-linear-to-b from-white/95 to-white/80 backdrop-blur-lg py-4`}
    >
      <Container>
        <div className="flex items-center justify-between md:justify-center gap-8 px-4">
          {/* Left Links - Desktop */}
          <ul className=" hidden lg:flex items-center gap-10">
            {navLinksLeft.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.pathname}
                  onClick={() => setActiveLink(item.pathname)}
                  className={`relative  py-2 font-bold transition-all duration-300 group border-b-3 border-transparent hover:border-primary ${
                    activeLink === item.pathname
                      ? "text-primary"
                      : "text-gray-700 hover:text-primary"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Center Logo */}
          <div className="lg:flex-none flex justify-center lg:justify-start">
            <Link
              href="/"
              className="flex items-center justify-center group"
              onClick={() => setActiveLink("/")}
            >
              <Image
                src="/test-route-driving-school-logo.png"
                width={100}
                height={100}
                alt="Test Route Driving School Logo"
                className="object-contain rounded-full transition-all duration-300 group-hover:scale-105 "
              />
            </Link>
          </div>

          {/* Right Links - Desktop */}
          <ul className="hidden lg:flex items-center gap-10">
            {navLinksRight.map((item) => (
              <li key={item.id} className="relative group">
                <Link
                  href={item.pathname || "#"}
                  onClick={() => setActiveLink(item.pathname)}
                  className={`relative py-2 font-bold transition-all duration-300 group flex items-center gap-1 border-b-2 border-transparent hover:border-primary ${
                    activeLink === item.pathname
                      ? "text-primary"
                      : "text-gray-700 hover:text-primary"
                  }`}
                >
                  {item.label}{" "}
                  {item.dropdowns && <MdKeyboardArrowDown size={18} />}
                </Link>

                {/* Dropdown */}
                {item.dropdowns && (
                  <ul className="absolute top-full left-0 bg-white shadow-md rounded-md opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 z-50">
                    {item.dropdowns.map((drop) => (
                      <li key={drop.id}>
                        <Link
                          href={drop.pathname}
                          className="block px-4 py-2 hover:bg-blue-50 text-gray-700 hover:text-primary font-bold"
                        >
                          {drop.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          <PrimaryBtn className="hidden md:flex">
            Book Now <FaAngleRight />
          </PrimaryBtn>
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-2xl p-3 rounded-xl bg-blue-50 hover:bg-blue-50 hover:text-primary transition-all duration-300 group"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <div className="relative">
              {open ? (
                <FiX className="group-hover:rotate-90 transition-transform duration-300" />
              ) : (
                <FiMenu className="group-hover:scale-110 transition-transform duration-300" />
              )}
            </div>
          </button>
        </div>
      </Container>

      {/* Mobile Dropdown */}
      <div
        className={`lg:hidden bg-white border-t shadow-2xl transform transition-all duration-500 ease-in-out ${
          open
            ? "max-h-screen opacity-100 translate-y-0"
            : "max-h-0 opacity-0 -translate-y-4"
        } overflow-hidden`}
      >
        <div className="px-6 py-8">
          <ul className="flex flex-col gap-1">
            {[...navLinksLeft, ...navLinksRight].map((item) => (
              <>
                <Link href={item.pathname || "#"}>{item.label}</Link>
                {item.dropdowns &&
                  item.dropdowns.map((drop) => (
                    <Link key={drop.id} href={drop.pathname} className="pl-6">
                      {drop.label}
                    </Link>
                  ))}
              </>
            ))}

            {/* Mobile CTA Button */}
            <li
              className="mt-4 transform transition-all duration-300"
              style={{
                transitionDelay: open ? "300ms" : "0ms",
                transform: open ? "translateX(0)" : "translateX(-20px)",
                opacity: open ? 1 : 0,
              }}
            >
              <button
                onClick={() => setOpen(false)}
                className="w-full px-6 py-4 bg-linear-to-r from-primary to-blue-700 text-white font-semibold rounded-2xl hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 active:scale-95 group"
              >
                <span className="flex items-center justify-center gap-2">
                  Book a Driving Lesson
                  <FiChevronRight className="group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
