"use client";

import PageHeroSection from "@/app/shared/ui/PageHeroSection";
import BlogSection from "../components/Blogs/BlogSection";

export default function Blogs() {
  return (
    <>
      <PageHeroSection
        title={`Driving Tips & Practical Insights`}
        subtitle={`Explore expert advice, proven techniques, and real driving strategies to help you stay safe on Sydney roads. Our articles focus on real learner challenges, test preparation, and everyday driving situations. Each guide helps you improve control, confidence, and road awareness step by step. You learn smarter. You practise better. You drive with confidence.`}
      />

      <BlogSection />
    </>
  );
}
