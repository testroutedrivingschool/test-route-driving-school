"use client";

import {useEffect, useState} from "react";
import {useRef} from "react";
import {FaSignOutAlt} from "react-icons/fa";

import Link from "next/link";
import Image from "next/image";
import {FiMenu, FiX, FiChevronRight, FiChevronDown} from "react-icons/fi";
import {FaAngleRight} from "react-icons/fa";
import {MdDashboard, MdKeyboardArrowDown} from "react-icons/md";
import Container from "./Container";
import SecondaryBtn from "../Buttons/SecondaryBtn";
import PrimaryBtn from "../Buttons/PrimaryBtn";
import useAuth from "@/app/hooks/useAuth";
import {toast} from "react-toastify";
import {usePathname} from "next/navigation";
import {useUserData} from "@/app/hooks/useUserData";
import {useRouter} from "next/navigation";
const navlinks = [
  {id: 1, label: "Home", pathname: "/"},
  {id: 2, label: "About", pathname: "/about"},
  {id: 3, label: "Instructors", pathname: "/instructors"},
  {
    id: 4,
    label: "Services",
    pathname: "/services",
    dropdowns: [
      {
        id: 1,
        label: "Automatic Driving Lessons",
        pathname: "/services/automatic-driving-lessons",
      },
      {
        id: 2,
        label: "Driving Test Assessment",
        pathname: "/services/driving-test-assessment",
      },
      {
        id: 3,
        label: "Driving Test Package",
        pathname: "/services/driving-test-package",
      },
      {
        id: 4,
        label: "Car Hire for Instructor",
        pathname: "/services/car-hire-for-instructor",
      },
      {
        id: 5,
        label: "Parking Package",
        pathname: "/services/parking-package",
      },
      {
        id: 6,
        label: "Highway Package",
        pathname: "/services/highway-package",
      },
      {
        id: 7,
        label: "Night Driving Lesson",
        pathname: "/services/night-driving-lesson",
      },
      {
        id: 8,
        label: "City Driving Package",
        pathname: "/services/city-driving-package",
      },
    ],
  },

  {id: 5, label: "Package", pathname: "/packages"},
  {id: 6, label: "Area Covered", pathname: "/area-covered"},
  {id: 7, label: "FAQ", pathname: "/faq"},
  {
    id: 8,
    label: "Company",

    dropdowns: [
      {id: 1, label: "Resources", pathname: "/company/resources"},
      {id: 2, label: "Gallery", pathname: "/company/gallery"},
      {id: 3, label: "Testimonials", pathname: "/company/testimonials"},
      {id: 4, label: "Blogs", pathname: "/blogs"},
      {id: 5, label: "Contact", pathname: "/company/contact"},
    ],
  },
];
const instructorNavLinks = [
  {id: 1, label: "Home", pathname: "/"},
  {id: 2, label: "Dashboard", pathname: "/dashboard"},
  {id: 3, label: "Bookings", pathname: "/instructor-bookings"},
  {id: 4, label: "Clients", pathname: "/clients"},
  {id: 5, label: "Sales", pathname: "/instructor/sales/search"},
  {id: 6, label: "Reports", pathname: "/instructor-reports"},
];

export default function Navbar({className}) {
  const [avatarOpen, setAvatarOpen] = useState(false);

  const avatarRef = useRef(null);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const {logoutUser} = useAuth();
  const {data: userData, isLoading} = useUserData();
  const router = useRouter();
  const isInstructor = userData?.role === "instructor";

  const finalNavLinks = isInstructor ? instructorNavLinks : navlinks;

  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };
  const handleLogout = () => {
    logoutUser()
      .then(() => {
        toast.success("Logged out successfully");
      })
      .catch(() => {
        toast.error("Failed to log out");
      });
  };

  return (
    <nav
      className={`${className} z-50 transition-all duration-500 ease-out bg-linear-to-b from-white/95 to-white/80 backdrop-blur-lg border-b border-b-border-color py-2 shadow`}
    >
      <Container>
        <div className="flex items-center justify-between ">
          {/* Logo */}
          <div className="lg:flex-none flex justify-center lg:justify-start">
            <Link href="/" className="flex items-center gap-2 group">
              <Image
                src="/test-route-driving-school-logo.png"
                alt="Test Route Driving School Logo"
                width={80}
                height={80}
                loading="eager"
                className="object-contain rounded-full transition-all duration-300
                 w-13 h-13 sm:w-16 sm:h-16 md:w-18 md:h-18"
              />
              <div>
                <h2 className="block font-bold text-primary text-lg md:text-lg leading-4.5">
                  Test Route
                </h2>
                <h2 className="block font-black text-primary text-lg md:text-lg ">
                  Driving School
                </h2>
              </div>
            </Link>
          </div>

          <ul className="hidden lg:flex items-center gap-10">
            {finalNavLinks.map((item) => (
              <li key={item.id} className="relative group">
                <Link
                  href={item.pathname || "#"}
                  aria-label={item.label}
                  className={`relative py-2 font-semibold lg:font-bold transition-all duration-300 group flex items-center gap-1  hover:border-primary ${
                    pathname === item.pathname
                      ? "text-primary border-b-3 border-primary"
                      : "text-gray-700 hover:text-primary border-b-3 border-transparent"
                  }`}
                >
                  {item.label}{" "}
                  {item.dropdowns && <MdKeyboardArrowDown size={18} />}
                </Link>

                {/* Dropdown */}
                {item.dropdowns && item.label === "Company" && (
                  <div className="absolute top-full left-0 right-0 z-50 opacity-0 invisible group-hover:opacity-100 w-full min-w-40 group-hover:visible  transition-all duration-300">
                    <div className="">
                      <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
                        <ul className="grid grid-cols-1  gap-2 py-4">
                          {item.dropdowns.map((drop) => (
                            <li key={drop.id}>
                              <Link
                                href={drop.pathname}
                                 aria-label={drop.label}
                                className="flex items-start gap-2 px-4 py-2  hover:bg-primary/10 transition-all"
                              >
                                <span className="text-primary mt-1">
                                  <FaAngleRight />
                                </span>

                                <div className="min-w-0">
                                  <p className=" font-semibold text-gray-900 whitespace-nowrap">
                                    {drop.label}
                                  </p>
                                </div>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {item.dropdowns && item.label !== "Company" && (
                  <div
                    className="absolute top-full left-1/2 -translate-x-1/2 z-50
    w-screen max-w-[95vw] md:max-w-3xl
    opacity-0 invisible group-hover:opacity-100 group-hover:visible
    transition-all duration-300"
                  >
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                      {/* Grid */}
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {item.dropdowns.map((drop) => (
                          <li key={drop.id}>
                            <Link
                              href={drop.pathname}
                               aria-label={drop.label}
                              className="group flex items-start gap-3 p-3 rounded-xl hover:bg-primary/10 transition-all"
                            >
                              {/* Icon */}
                              <span className="mt-1 text-primary">
                                <FaAngleRight />
                              </span>

                              {/* Text */}
                              <div>
                                <p className="font-semibold text-gray-800 group-hover:text-primary">
                                  {drop.label}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Learn more about {drop.label.toLowerCase()}
                                </p>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
          <div className="flex gap-4 md:gap-6 ">
            {userData ? (
              <div ref={avatarRef} className="relative">
                {/* Avatar Button */}
                <button
                  onClick={() => setAvatarOpen(!avatarOpen)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  <div className="w-10 h-10 md:w-11 md:h-11  rounded-full overflow-hidden border-2 border-primary ring-2 ring-offset-2 ring-offset-white hover:ring-primary/40 transition">
                    {userData.photo ? (
                      <Image
                        src={userData.photo}
                        alt={userData.name || "User"}
                        width={48}
                        height={48}
                        className="object-cover object-top w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary text-white flex items-center justify-center font-semibold">
                        {userData.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}
                  </div>
                </button>

                {/* Dropdown */}
                <div
                  className={`absolute right-0 mt-3 w-56 rounded-2xl bg-white shadow-xl border border-border-color z-50
      transition-all duration-200 origin-top-right
      ${
        avatarOpen
          ? "opacity-100 scale-100 translate-y-0"
          : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
      }`}
                >
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-border-color">
                    <p className="font-semibold text-gray-900 truncate">
                      {userData.name || "User"}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {userData.email}
                    </p>
                  </div>

                  {/* Links */}
                  <ul className="py-2">
                    <li>
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-primary/10 transition"
                        onClick={() => setAvatarOpen(false)}
                      >
                        <MdDashboard className="text-primary" />
                        Dashboard
                      </Link>
                    </li>
                  </ul>

                  {/* Logout */}
                  <div className="border-t border-border-color">
                    <button
                      onClick={() => {
                        // logout function here
                        handleLogout();
                        setAvatarOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition"
                    >
                      <FaSignOutAlt />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/login" className="inline-block">
                <SecondaryBtn className="hidden md:flex">
                  Login <FaAngleRight />
                </SecondaryBtn>
              </Link>
            )}

            <button
              className="lg:hidden text-2xl p-2 md:p-3 rounded-xl bg-blue-50 hover:bg-blue-50 hover:text-primary transition-all duration-300 group text-black"
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
          {/* Mobile Menu Button */}
        </div>
      </Container>
      {/* Mobile Dropdown */}
      <div
        className={`lg:hidden mt-2 bg-white border-t border-border-color transform transition-all duration-500 ease-in-out ${
          open
            ? "min-h-[50vh] opacity-100 translate-y-0"
            : "max-h-0 opacity-0 -translate-y-4"
        } overflow-hidden`}
      >
        <div className="py-4">
          <ul className="flex flex-col gap-0">
            {finalNavLinks.map((item) => (
              <li
                key={item.id}
                className="flex flex-col border-b border-gray-200"
              >
                {/* Main Link */}
                <Link
                  href={item.pathname || "#"}
                   aria-label={item.pathname}
                  onClick={() =>
                    item.dropdowns ? toggleDropdown(item.id) : setOpen(false)
                  }
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
                </Link>

                {/* Dropdown Links */}
                {item.dropdowns && activeDropdown === item.id && (
                  <ul className="flex flex-col ml-4 bg-gray-50">
                    {item.dropdowns.map((drop) => (
                      <li key={drop.id} className="border-b border-gray-200">
                        <Link
                          href={drop.pathname}
                           aria-label={drop.label}
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
            {userData ? (
              <li className="mt-4 px-5">
                <button
                  onClick={() => {
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-3 px-4 bg-red-500 rounded border border-transparent  hover:border-red-500 py-2 text-white hover:bg-red-600 transition"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </li>
            ) : (
              <li className="mt-4 px-5">
                <PrimaryBtn
                  onClick={() => {
                    router.push("/login");
                    setOpen(false);
                  }}
                  className="w-full flex justify-center items-center gap-2"
                >
                  Login
                  <FiChevronRight className="group-hover:translate-x-1 transition-transform duration-300" />
                </PrimaryBtn>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
