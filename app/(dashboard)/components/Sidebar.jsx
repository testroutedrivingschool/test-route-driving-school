"use client";

import React, {useState, useEffect} from "react";
import {FiLogOut, FiMenu, FiX} from "react-icons/fi";
import {GoSidebarCollapse, GoSidebarExpand} from "react-icons/go";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useUserData} from "@/app/hooks/useUserData";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import Image from "next/image";
import {
  adminSidebarLinks,
  instructorSidebarLinks,
  userSidebarLinks,
} from "./sidebarLinks";
export default function Sidebar() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const {data: userData, isLoading} = useUserData();
  const sidebarLinks =
    userData?.role === "admin"
      ? adminSidebarLinks
      : userData?.role === "instructor"
      ? instructorSidebarLinks
      : userSidebarLinks;

  // Detect mobile and set initial state
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleItemClick = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Mobile Overlay */}
          {isMobile && sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Mobile Toggle Button */}
          {isMobile && (
            <div className="lg:hidden sticky  left-0 z-50  p-3 bg-secondary text-white border border-border-color shadow w-full flex justify-between items-center">
              <h2 className="text-lg font-bold">Dashboard</h2>
              <button
                onClick={toggleSidebar}
                className="rounded-xl  shadow-lg  border-white hover:bg-gray-50 hover:text-primary transition-all duration-300 p-3"
              >
                {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          )}

          {/* Sidebar */}
          <aside
            className={`
          fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-border-color 
          transition-all duration-300 ease-in-out
          flex flex-col z-999
          ${
            isMobile
              ? sidebarOpen
                ? "translate-x-0 shadow-2xl"
                : "-translate-x-full"
              : sidebarOpen
              ? "w-64"
              : "w-20"
          }
        `}
          >
            {/* Logo Section */}
            <div className="p-6 border-b border-border-color">
              <div className="flex items-center justify-between">
                {sidebarOpen || isMobile ? (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10  rounded-xl flex items-center justify-center ">
                      <Image
                        className="w-full h-full object-cover object-top rounded-full"
                        width={20}
                        height={20}
                        src={userData.photo}
                        alt={userData.name}
                      />
                    </div>
                    <div
                      className={`transition-all duration-300 ${
                        !isMobile && !sidebarOpen
                          ? "opacity-0 w-0"
                          : "opacity-100"
                      }`}
                    >
                      <h3 className="font-bold text-lg">
                        {" "}
                        {userData.name.split(" ").slice(0, 2).join(" ")}
                      </h3>
                      <div className="text-sm font-medium text-neutral capitalize">
                        {userData.role}
                      </div>
                    </div>
                  </div>
                ) : (
                  <></>
                )}

                {!isMobile && (
                  <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-lg hover:bg-base-300 transition-colors"
                  >
                    {sidebarOpen ? (
                      <GoSidebarExpand size={22} />
                    ) : (
                      <GoSidebarCollapse size={22} />
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {sidebarLinks.map((item) => {
                const isActive =
                  item.path === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname === item.path ||
                      pathname.startsWith(item.path + "/");

                return (
                  <div
                    key={item.id}
                    className="relative"
                    onMouseEnter={() =>
                      !sidebarOpen && !isMobile && setHoveredItem(item.id)
                    }
                    onMouseLeave={() =>
                      !sidebarOpen && !isMobile && setHoveredItem(null)
                    }
                  >
                    <Link
                      href={item.path}
                      onClick={handleItemClick}
                      className={`
                    group flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-200
                    ${
                      isActive
                        ? "bg-primary/10 text-primary border border-border-color"
                        : "text-gray-700 hover:bg-gray-100"
                    }
                    ${!sidebarOpen && !isMobile ? "justify-center" : ""}
                  `}
                    >
                      <div
                        className={`relative ${
                          !sidebarOpen && !isMobile ? "mx-auto" : ""
                        }`}
                      >
                        <div
                          className={`text-xl ${
                            isActive
                              ? "text-primary"
                              : "text-gray-500 group-hover:text-primary"
                          }`}
                        >
                          {item.icon}
                        </div>
                      </div>

                      {(sidebarOpen || isMobile) && (
                        <span className="font-medium truncate">
                          {item.label}
                        </span>
                      )}
                    </Link>
                  </div>
                );
              })}
            </nav>

            {/* Bottom Section */}
            <div className="p-4 border-t border-gray-200 space-y-2">
              {/* Logout Button */}
              <button
                className={`
            flex items-center gap-3 w-full p-3 rounded-xl text-white   bg-primary transition-colors
            ${!sidebarOpen && !isMobile ? "justify-center" : ""}
          `}
              >
                <FiLogOut className="text-white" />
                {(sidebarOpen || isMobile) && (
                  <span className="font-medium">Logout</span>
                )}
              </button>
            </div>
          </aside>

          {/* Main content padding for mobile */}
          {isMobile && (
            <div
              className={`transition-all duration-300 ${
                sidebarOpen ? "lg:ml-20" : ""
              }`}
            ></div>
          )}
        </>
      )}
    </>
  );
}
