"use client";
import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import Container from "@/app/shared/ui/Container";
import SectionHeader from "@/app/shared/ui/SectionHeader";
import Image from "next/image";
import React from "react";
import testPackageImg1 from "@/app/assets/test-packageimg1.jpg";
import testPackageImg2 from "@/app/assets/test-packageimg2.png";
import {FaCheckCircle, FaStar, FaArrowRight} from "react-icons/fa";
import {addToCartLS} from "@/app/utils/cart";
import {useRouter} from "next/navigation";
import Link from "next/link";

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
    addToCartLS(pkg);
    router.push("/cart");
  };

  return (
    <section className="py-10 md:py-16 bg-white">
      <Container>
        <SectionHeader
          title="Driving Test Packages"
          subtitle={
            <>
              Choose the perfect test package to identify areas for improvement
              and boost your confidence before the official test. Learn more
              about our
              <Link
                href="/services/driving-test-package"
                className="text-primary font-semibold underline hover:no-underline ml-1"
              >
                Driving Test service.
              </Link>
            </>
          }
          className="mt-0! mb-8 md:mb-14"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
          <PackageCard
            image={testPackageImg1}
            title="Car Hire with 1 Hour Lesson"
            subtitle="Use car for driving test"
            price="$220"
            features={[
              "Pick up 1 hour before driving test",
              "45 mins warm-up lesson before test",
              "Use car for driving test",
              "Drop off after test result",
            ]}
            pkg={packages[0]}
            onAdd={handleAddToCart}
          />

          <PackageCard
            image={testPackageImg2}
            title="Car Hire with 2 Hour Lesson"
            subtitle="Use car for driving test"
            price="$290"
            features={[
              "Pick up 2 hour before driving test",
              "1 hour 45 mins of warm up lesson before test",
              "Use car for driving test",
              "Drop off after test result",
            ]}
            pkg={packages[1]}
            onAdd={handleAddToCart}
          />
        </div>
      </Container>
    </section>
  );
}

function PackageCard({image, title, subtitle, price, features, pkg, onAdd}) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-56 sm:h-64 md:h-72 lg:h-75 w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 md:p-6">
        {/* Title + Price */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
          <div className="flex-1">
            <h2 className="font-bold text-lg sm:text-xl md:text-2xl text-gray-800 leading-snug">
              {title}
            </h2>
            <p className="text-neutral text-xs sm:text-sm font-medium mt-1">
              ({subtitle})
            </p>
          </div>

          <div className="sm:text-right shrink-0">
            <p className="text-2xl md:text-3xl font-bold text-primary leading-none">
              {price}
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-3 mb-5">
          {features.map((text, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full bg-green-100 shrink-0 mt-0.5">
                <FaCheckCircle className="text-green-500 text-xs sm:text-sm" />
              </div>
              <p className="text-gray-700 text-sm sm:text-[15px] leading-relaxed">
                {text}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <PrimaryBtn
            className="w-full sm:w-auto justify-center text-sm! md:text-lg! px-5! py-3!"
            onClick={(e) => onAdd(pkg, e)}
          >
            Get this package <FaArrowRight className="ml-2" />
          </PrimaryBtn>

          <span className="text-xs sm:text-sm text-gray-500 flex items-center justify-center sm:justify-start gap-1">
            <FaStar className="text-yellow-400" />
            Trusted by learners
          </span>
        </div>
      </div>
    </div>
  );
}