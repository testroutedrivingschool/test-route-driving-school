"use client";
import React from "react";
import heroImg from "@/app/assets/whychooseus-test-route-driving-school.jpg";
import Container from "./Container";

export default function PageHeroSection({title,subtitle}) {
  
  return (
    <section className="relative w-full min-h-38 py-10">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{backgroundImage: `url(${heroImg.src})`}}
      ></div>

      {/* Overlay with primary color */}
      <div className="absolute inset-0 bg-secondary/50"></div>
      {/* Replace 'blue-700' with your primary color */}

      {/* Centered Title */}
      <div className="relative z-10  h-full">
  <Container className="flex flex-col justify-center h-full pl-8">
  <h1 className="text-white text-3xl font-bold max-w-xl">
    {title}
  </h1>

  <p
    className="
      relative
      mt-3
      max-w-xl
      text-base-300
      pl-6
      leading-relaxed

      before:content-['']
      before:absolute
      before:left-0
      before:top-1
      before:h-[95%]
      before:w-1
      before:bg-primary
      before:rounded-full
    "
  >
    {subtitle}
  </p>
</Container>


      </div>
    </section>
  );
}
