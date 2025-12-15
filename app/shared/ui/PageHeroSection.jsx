"use client";
import React from "react";
import heroImg from "@/app/assets/whychooseus-test-route-driving-school.jpg";
import {FaChevronRight} from "react-icons/fa";
import {usePathname} from "next/navigation";

export default function PageHeroSection({title}) {
  const pathname =usePathname();
    const formattedPath = pathname
    .split("/")                 
    .filter(Boolean)              
    .map((segment) =>           
      segment.charAt(0).toUpperCase() + segment.slice(1)
    )
    .join(" / ") || "Home";  
  return (
    <section className="relative w-full h-38">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{backgroundImage: `url(${heroImg.src})`}}
      ></div>

      {/* Overlay with primary color */}
      <div className="absolute inset-0 bg-secondary/50"></div>
      {/* Replace 'blue-700' with your primary color */}

      {/* Centered Title */}
      <div className="relative z-10 flex flex-col gap-2 items-center justify-center h-full">
        <h1 className="text-white text-3xl font-bold text-center">{title}</h1>
        <p className="text-white flex items-center gap-2">
          Home <FaChevronRight />{" "}
          {formattedPath}
        </p>
      </div>
    </section>
  );
}
