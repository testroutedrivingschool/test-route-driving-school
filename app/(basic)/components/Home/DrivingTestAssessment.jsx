"use client"
import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import Container from "@/app/shared/ui/Container";
import SectionHeader from "@/app/shared/ui/SectionHeader";
import {addToCartLS} from "@/app/utils/cart";
import {useRouter} from "next/navigation";
import React from "react";
import {
  FaCheckCircle,
  FaCar,
  FaFileAlt,
  FaVideo,
  FaHome,
  FaClock,
  FaArrowRight,
  FaTimesCircle,
} from "react-icons/fa";

const packages = [
  {
    _id: "695be1371f72e6c2fa81e094",
    name: "1 hour 30 mins Driving Test Assessment",
    packageThumbline: "/pkg.png",
    duration: "1 hr 30 min",
    price: 140,
    originalPrice: "$170",
    icon: <FaClock className="text-primary" />,
    features: [
      {
        icon: <FaHome className="text-green-500" />,
        text: "Pick Up and Drop Off from Your Location",
        included: true,
      },
      {
        icon: <FaCar className="text-blue-500" />,
        text: "One Driving Test Assessment from the RMS Driving Test Center",
        included: true,
      },
      {
        icon: <FaFileAlt className="text-purple-500" />,
        text: "Test Assessment Report at the End of the Session",
        included: true,
      },
      {
        icon: <FaVideo className="text-red-500" />,
        text: "Access to our tutorial videos and training materials",
        included: true,
      },
      {
        icon: <FaCar className="text-yellow-500" />,
        text: "Warm Up Lesson",
        included: true,
      },
    ],
  },
  {
    _id: "695beb281f72e6c2fa81e097",
    name: "2 Hours Driving Test Assessment",
    packageThumbline: "/pkg.png",
    duration: "2 hr",
    price: 175,
    originalPrice: "$200",
    icon: <FaClock className="text-primary" />,
    features: [
      {
        icon: <FaHome className="text-green-500" />,
        text: "Pick Up and Drop Off from Your Location",
        included: true,
      },
      {
        icon: <FaCar className="text-blue-500" />,
        text: "Two Driving Test Assessments from the RMS Driving Test Center",
        included: true,
      },
      {
        icon: <FaFileAlt className="text-purple-500" />,
        text: "Test Assessment Report at the End of the Session",
        included: true,
      },
      {
        icon: <FaVideo className="text-red-500" />,
        text: "Access to our tutorial videos and training materials",
        included: true,
      },
      {
        icon: <FaCar className="text-yellow-500" />,
        text: "Warm Up Lesson",
        included: true,
      },
    ],
  },
];

export default function DrivingTestAssessment() {
  const router = useRouter();
  const handleAddToCart = (pkg, e) => {
    e.preventDefault();
  

    addToCartLS(pkg);
    router.push("/cart");
  };
  return (
    <section className="py-17 bg-base-300">
      <Container>
        <SectionHeader
          title="Driving Test Assessment Packages"
          subtitle="Choose the perfect assessment package to identify areas for improvement and boost your confidence before the official test."
          className="mt-0! mb-12"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {packages.map((pkg, index) => (
            <div key={index} className={`relative group `}>
              {/* Card */}
              <div
                className={`h-full bg-white rounded-xl border-2 
                 border-gray-200 shadow  transition-all duration-500 overflow-hidden flex flex-col`}
              >
                {/* Header */}
                <div className={`p-6 text-center bg-primary/10`}>
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-white border-2 border-primary flex items-center justify-center">
                      <div className="text-2xl">{pkg.icon}</div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {pkg.duration} Package
                    </h3>
                  </div>

                  {/* Price */}
                  <div className="mt-4">
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-4xl font-bold text-gray-900">
                        ${pkg.price}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Features List */}
                <div className="p-6 flex-1">
                  <div className="space-y-3">
                    {pkg.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className={`flex items-start gap-3 py-1 px-3 rounded-lg transition-colors ${
                          feature.included ? "hover:bg-gray-50" : "opacity-60"
                        }`}
                      >
                        <div className="shrink-0 mt-0.5">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              feature.included ? "bg-gray-100" : "bg-gray-50"
                            }`}
                          >
                            {feature.included ? (
                              <FaCheckCircle className="text-green-500" />
                            ) : (
                              <FaTimesCircle className="text-gray-400" />
                            )}
                          </div>
                        </div>
                        <span
                          className={`text-md ${
                            feature.included ? "text-gray-700" : "text-gray-500"
                          }`}
                        >
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="px-6">
                  <div className="border-t border-gray-200"></div>
                </div>

                {/* CTA Section */}
                <div className="p-6">
                  <PrimaryBtn
                    onClick={(e) => handleAddToCart(pkg, e)}
                    className={`w-full py-4 rounded-xl font-bold text-lg group ${
                      pkg.highlight
                        ? "bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                        : ""
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      Get {pkg.duration} Package
                      <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </PrimaryBtn>
                </div>
              </div>

              {/* Hover Glow Effect */}
              {pkg.highlight && (
                <div className="absolute -inset-1 bg-linear-to-r from-blue-500 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-500 -z-10"></div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
