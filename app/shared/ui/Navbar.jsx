"use client";

import {useState} from "react";
import Link from "next/link";
import Image from "next/image";
import {FiMenu, FiX, FiChevronRight, FiChevronDown} from "react-icons/fi";
import {FaAngleRight} from "react-icons/fa";
import {MdKeyboardArrowDown} from "react-icons/md";
import Container from "./Container";
import SecondaryBtn from "../Buttons/SecondaryBtn";
import PrimaryBtn from "../Buttons/PrimaryBtn";

const navlinks = [
  {id: 1, label: "Home", pathname: "/"},
  {id: 2, label: "About", pathname: "/about"},
  {id: 3, label: "Instructors", pathname: "/instructors"},
  {id: 4, label: "Services", pathname: "/services"},
  {id: 5, label: "Resources", pathname: "/resources"},
  {id: 6, label: "Package", pathname: "/packages"},
  {
    id: 7,
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
 const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };
  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-500 ease-out bg-linear-to-b from-white/95 to-white/80 backdrop-blur-lg py-2`}
    >
      <Container>
        <div className="flex items-center justify-between ">
          {/* Logo */}
          <div className="lg:flex-none flex justify-center lg:justify-start">
            <Link
              href="/"
              className="flex items-center gap-2 group"
              onClick={() => setActiveLink("/")}
            >
               <Image
      src="/test-route-driving-school-logo.png"
      alt="Test Route Driving School Logo"
      width={80} // default desktop size
      height={80}
      className="object-contain rounded-full transition-all duration-300
                 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20" // responsive sizes
    />
              <div>
                <h2 className="block font-bold text-primary text-lg md:text-xl leading-4.5">Test Route</h2>
                <h2 className="block font-black text-primary text-lg md:text-xl ">Driving School</h2>
              </div>
            </Link>
          </div>

        
          <ul className="hidden lg:flex items-center gap-10">
            {navlinks.map((item) => (
              <li key={item.id} className="relative group">
                <Link
                  href={item.pathname || "#"}
                  onClick={() => setActiveLink(item.pathname)}
                  className={`relative py-2 font-bold transition-all duration-300 group flex items-center gap-1  hover:border-primary ${
                    activeLink === item.pathname
                      ? "text-primary border-b-3 border-primary"
                      : "text-gray-700 hover:text-primary border-b-3 border-transparent"
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
          <SecondaryBtn className="hidden md:flex">
            Book Now <FaAngleRight />
          </SecondaryBtn>
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
      className={`lg:hidden mt-2 bg-white border-t border-border-color transform transition-all duration-500 ease-in-out ${
        open
          ? "max-h-screen opacity-100 translate-y-0"
          : "max-h-0 opacity-0 -translate-y-4"
      } overflow-hidden`}
    >
      <div className="py-4">
        <ul className="flex flex-col gap-0">
          {navlinks.map((item) => (
            <li key={item.id} className="flex flex-col border-b border-gray-200">
              {/* Main Link */}
              <button
                onClick={() => item.dropdowns ? toggleDropdown(item.id) : setOpen(false)}
                className="w-full flex justify-between items-center px-5 py-3 text-gray-800 font-medium hover:bg-primary hover:text-white transition-colors duration-300"
              >
                {item.label}
                {item.dropdowns && (
                  <FiChevronDown
                    className={`ml-2 transition-transform duration-300 ${
                      activeDropdown === item.id ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>

              {/* Dropdown Links */}
              {item.dropdowns && activeDropdown === item.id && (
                <ul className="flex flex-col ml-4 bg-gray-50">
                  {item.dropdowns.map((drop) => (
                    <li key={drop.id} className="border-b border-gray-200">
                      <Link
                        href={drop.pathname}
                        onClick={() => setOpen(false)}
                        className="block px-5 py-2 text-gray-700 hover:bg-primary hover:text-white transition-colors duration-300"
                      >
                        {drop.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}

          {/* Mobile CTA Button */}
          <li className="mt-4 px-5">
            <PrimaryBtn
              onClick={() => setOpen(false)}
              className="w-full flex justify-center items-center gap-2"
            >
              Book a Driving Lesson
              <FiChevronRight className="group-hover:translate-x-1 transition-transform duration-300" />
            </PrimaryBtn>
          </li>
        </ul>
      </div>
    </div>


    </nav>
  );
}
