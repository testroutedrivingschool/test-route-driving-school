import PageHeroSection from "@/app/shared/ui/PageHeroSection";
import React from "react";

import blogImg18 from "@/app/assets/blog/blog18.jpg";
import Image from "next/image";
import Container from "@/app/shared/ui/Container";
import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import Link from "next/link";

const blogItems = [
          "**Manual Cars**:",
          "- **Pros**: Typically cheaper, better control over the vehicle, more fuel-efficient in some cases, and great for learning essential driving skills.",
          "- **Cons**: Can be difficult in heavy traffic, requires constant clutch and gear use, and can be tiring for beginners.",
          "**Automatic Cars**:",
          "- **Pros**: Easier to drive, especially in stop-and-go traffic, less stressful for beginners, and convenient for city driving.",
          "- **Cons**: Usually more expensive, less control over engine power, and may be less fuel-efficient in some models.",
        ];

export const metadata = {
  title: "Manual vs Automatic Cars: Which to Choose?",
  description:
    "Pros and cons of manual and automatic cars to help you make the right decision.",
  keywords: [
    "Manual vs Automatic Cars",
    "NSW driving test process",
    "NSW practical driving test steps",
    "driving test NSW checklist",
    "how long is the NSW driving test",
    "test day requirements NSW",
    "driving test centre",
    "test day requirements NSW",
    "Driving Test Manoevres",
    "booking the driving test",
    "Driving skills assessed",
  ],
};
export default function Blog18() {
  return (
    <>
      <PageHeroSection
        title={"Manual vs Automatic Cars: Which to Choose?"}
        subtitle={
          "Learn the most important driving habits that will keep you safe and confident on the road."
        }
      />

      <section className="py-16 bg-base-300">
        <Container>
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            {/* Blog Image */}
            <div className="relative w-full h-80 md:h-[700px]">
              <Image
                src={blogImg18}
                alt={"How to Master Parallel Parking"}
                fill
                className="object-cover w-full h-full object-center"
              />
            </div>

            {/* Blog Content */}
            <div className="p-8 md:p-12">
              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold mb-6">
             Manual vs Automatic Cars: Which to Choose?
              </h1>
              <p className="text-neutral mb-6">
              Choosing between a manual and an automatic car is an important decision for new drivers. Each has its own advantages and challenges:
              </p>
              {/* Content */}
              <div className="prose prose-lg max-w-full text-gray-700 mb-8">
                <ul className="list-disc list-inside mb-4">
                  {blogItems.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <p className="text-neutral mb-6">
               When deciding, consider your driving environment, budget, and long-term goals. If you plan to drive in congested city areas, an automatic may be more comfortable. If you enjoy more control and want to save on initial costs, a manual car could be ideal.,
      Ultimately, understanding the pros and cons of each type helps you make an informed decision and ensures a smooth and enjoyable driving experience.
              </p>

              <Link href={`/blogs`}>
                <PrimaryBtn>← Back to Blogs</PrimaryBtn>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
