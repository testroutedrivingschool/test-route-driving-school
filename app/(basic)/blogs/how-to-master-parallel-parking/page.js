import PageHeroSection from "@/app/shared/ui/PageHeroSection";
import React from "react";

import blogImg17 from "@/app/assets/blog/blog17.jpg";
import Image from "next/image";
import Container from "@/app/shared/ui/Container";
import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import Link from "next/link";

const blogItems = [
          "**Choose a Suitable Space**: Find a space that is slightly longer than your car. Avoid tight spots until you gain confidence.",
          "**Position Your Car**: Pull up alongside the car in front of the parking space, aligning your rear bumper with theirs.",
          "**Reverse Slowly**: Turn your steering wheel towards the curb while reversing slowly. Keep checking your mirrors and blind spots.",
          "**Adjust as Needed**: Once your car is at a 45-degree angle, straighten the wheels and continue reversing. Make small adjustments to align your car perfectly within the space.",
          "**Final Check**: Make sure your car is centered, not too close to the curb, and not obstructing traffic.",
        ];

export const metadata = {
  title: "How to Master Parallel Parking",
  description:
    "Step-by-step guide to improve your parking skills and avoid common mistakes.",
  keywords: [
    "Master Parallel Parking",
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
export default function Blog17() {
  return (
    <>
      <PageHeroSection
        title={"How to Master Parallel Parking"}
        subtitle={
          "Learn the most important driving habits that will keep you safe and confident on the road."
        }
      />

      <section className="py-16 bg-base-300">
        <Container>
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            {/* Blog Image */}
            <div className="relative w-full h-80 md:h-[500px]">
              <Image
                src={blogImg17}
                alt={"How to Master Parallel Parking"}
                fill
                className="object-cover w-full h-full object-center"
              />
            </div>

            {/* Blog Content */}
            <div className="p-8 md:p-12">
              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold mb-6">
              How to Master Parallel Parking
              </h1>
              <p className="text-neutral mb-6">
              Parallel parking is a skill that intimidates many drivers, but with practice, it can become second nature. Follow this step-by-step guide to master parallel parking:
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
                Regular practice in different parking situations will make this process easier. Remember, patience and slow movements are the key to perfect parallel parking.
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
