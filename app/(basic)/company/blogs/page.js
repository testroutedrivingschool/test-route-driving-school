"use client";

import PageHeroSection from "@/app/shared/ui/PageHeroSection";
import BlogSection from "../../components/Blogs/BlogSection";

export default function Blogs() {
  return (
    <>
      <PageHeroSection
        title={`Driving Tips & Insights`}
        subtitle={`Explore our latest articles, expert advice, and helpful tips to become a safer and more confident driver.`}
      />

      <BlogSection />
    </>
  );
}
