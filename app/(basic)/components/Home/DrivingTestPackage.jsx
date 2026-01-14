"use client";
import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import Container from "@/app/shared/ui/Container";
import SectionHeader from "@/app/shared/ui/SectionHeader";
import Image from "next/image";
import React from "react";
import testPackageImg1 from "@/app/assets/test-packageimg1.png";
import testPackageImg2 from "@/app/assets/test-packageimg2.png";
import {FaCheckCircle, FaStar, FaArrowRight} from "react-icons/fa";
import {addToCartLS} from "@/app/utils/cart";
import {useRouter} from "next/navigation";
export const packages = [
  {
    _id: "695bebe91f72e6c2fa81e098",
    name: "Test Package with 1 hour lesson",
    packageThumbline: "/pkg.png",
    regularPrice: "$250",
    price: 220,
    duration: "1 hour",
  },
  {
    _id: "695bfa251f72e6c2fa81e09c",
    name: "Test Package with 2 hours lesson",
    packageThumbline: "/pkg.png",
    regularPrice: "$300",
    price: 290,
    duration: "2 hours",
  },
];

export default function DrivingTestPackage() {
  const router = useRouter();
  const handleAddToCart = (pkg, e) => {
    e.preventDefault();
    console.log(pkg);

    addToCartLS(pkg);
    router.push("/cart");
  };
  return (
    <section className="py-20 bg-white">
      <Container>
        <SectionHeader
          title="Driving Test Packages"
          subtitle="Choose the perfect test package to identify areas for improvement and boost your confidence before the official test."
          className="mt-0! mb-14"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Package Card 1*/}
          <div className="group bg-base-300 rounded-xl overflow-hidden shadow hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
            {/* Image */}
            <div className="relative h-60 w-full overflow-hidden">
              <Image
                src={testPackageImg1}
                alt="Driving Test Package Test Route Driving School"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-2xl text-gray-800">
                  Car Hire with 1 Hour Lesson
                </h2>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">$220</p>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {[
                  "Pick up 1 hour before driving test",
                  "45 mins warm-up lesson before test",
                  "Use car for driving test",
                  "Drop off after test result",
                ].map((text, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-primary/5 transition"
                  >
                    <div className="w-6 h-6 flex items-center justify-center rounded-full bg-green-100 shrink-0">
                      <FaCheckCircle className="text-green-500 text-sm" />
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {text}
                    </p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="flex items-center justify-between">
                <PrimaryBtn onClick={(e) => handleAddToCart(packages[0], e)}>
                  Get this package <FaArrowRight className="ml-2" />
                </PrimaryBtn>

                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <FaStar className="text-yellow-400" />
                  Trusted by learners
                </span>
              </div>
            </div>
          </div>
          {/* Package Card 2 */}
          <div className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
            {/* Image */}
            <div className="relative h-60 w-full overflow-hidden">
              <Image
                src={testPackageImg2}
                alt="Driving Test Package Test Route Driving School"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-2xl text-gray-800">
                  Car Hire with 2 Hour lesson
                </h2>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">$220</p>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {[
                  "Pick up 2 hour before driving test",
                  "1 hour 45 mins of warm up lesson before test",
                  "Use car for driving test",
                  "Drop off after test result",
                ].map((text, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-primary/5 transition"
                  >
                    <div className="w-6 h-6 flex items-center justify-center rounded-full bg-green-100 shrink-0">
                      <FaCheckCircle className="text-green-500 text-sm" />
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {text}
                    </p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="flex items-center justify-between">
                <PrimaryBtn onClick={(e) => handleAddToCart(packages[1], e)}>
                  Get this package <FaArrowRight className="ml-2" />
                </PrimaryBtn>

                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <FaStar className="text-yellow-400" />
                  Trusted by learners
                </span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
