"use client";
import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import Container from "@/app/shared/ui/Container";
import SectionHeader from "@/app/shared/ui/SectionHeader";
import {addToCartLS} from "@/app/utils/cart";
import {useRouter} from "next/navigation";
import {FaCheck} from "react-icons/fa";
import {FiChevronRight} from "react-icons/fi";

export const packages = [
  {
    _id: "6952e6047fe9723b87c6aafe",
    name: "1 Hours Lesson Package",
    packageThumbline: "/pkg.png",
    description:
      "The 1 Hour Lesson Package is designed to give learner drivers to prepare for their driving test.",
    regularPrice: "$100",
    price: 75,
    duration: "1 hour",
    features: [
      "Automatic Driving Lesson - 7 days a week.",
      "Pick up and drop off at your desired location.",
      "One-to-one in-vehicle coaching.",
      "Teaching materials are provided.",
    ],
  },
  {
    _id: "695bfae01f72e6c2fa81e09d",
    name: "5 Hours Lesson Package",
    packageThumbline: "/pkg.png",
    description:
      "1 Hour × 5 Lessons Package at Test Route Driving School is perfect for learner drivers.",
    regularPrice: "$375",
    price: 360,
    duration: "5 hours",
    features: [
      "Automatic Driving Lesson - 7 days a week",
      "Pick up and drop off at your desired location",
      "One-to-one in-vehicle coaching",
      "Teaching materials are provided",
    ],
  
  },
  {
    _id: "695bfb6b1f72e6c2fa81e09e",
    name: "10 Hours Lesson Pack",
    packageThumbline: "/pkg.png",
    description:
      "1 Hour × 10 Lessons Package at Test Route Driving School is perfect for learner.",
    regularPrice: "$750",
    price: 700,
    duration: "10 hours",
    features: [
      "Automatic Driving Lesson - 7 days a week",
      "Pick up and drop off at your desired location",
      "One-to-one in-vehicle coaching",
      "Teaching materials are provided",
    

    ],
  },
];

export default function HomePackage() {
  const router = useRouter();
  const handleAddToCart = (pkg, e) => {
    e.preventDefault();
 
    addToCartLS(pkg);
    router.push("/cart");
  };
  return (
    <section className=" bg-base-300 py-16">
      <Container>
        <SectionHeader
          className={`mt-5!`}
          title="Driving Lesson Packages"
          subtitle="Choose the perfect package for your learning journey. All lessons include certified instructors and modern vehicles."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-10">
          {packages.map((pkg) => (
            <div
              key={pkg._id}
              className={`bg-white rounded-xl shadow border-b-8 border-b-primary transition-all duration-300 overflow-hidden border border-border-color flex flex-col `}
            >
              {pkg.popular && (
                <div className="bg-accent text-black text-center py-2 text-sm font-semibold">
                  ⭐ Most Popular
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col">
                {/* Package Header */}
                <div className="mb-6">
                  <div className="flex justify-between gap-1 items-start mb-2">
                    <h3 className="text-lg md:text-2xl font-bold text-gray-900">
                      {pkg.name}
                    </h3>
                    <span className="w-22 text-xs md:text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                      {pkg.duration}
                    </span>
                  </div>
                  <p className="text-neutral">{pkg.description}</p>
                </div>

                {/* Pricing */}
                <div className="mb-6 p-4 bg-linear-to-r from-gray-50 to-blue-50 rounded-xl">
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-gray-900">
                      ${pkg.price}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      ${pkg.regularPrice}
                    </span>
                    <span className="ml-auto text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                      Save $
                      {parseInt(pkg.regularPrice.slice(1)) -
                        parseInt(pkg.price)}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6 flex-1">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    What&apos;s included:
                  </h4>
                  <ul className="space-y-3">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="shrink-0 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                          <FaCheck className="text-blue-600" size={12} />
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <PrimaryBtn
                  onClick={(e) => handleAddToCart(pkg, e)}
                  className="mt-auto w-full py-3 group hover:scale-[1.02] transition-transform duration-200"
                >
                  <span className="flex items-center justify-center gap-2 font-semibold">
                    Get This Package
                    <FiChevronRight className="group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </PrimaryBtn>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <PrimaryBtn
            onClick={() => router.push("/packages")}
            className={`py-4`}
          >
            View All Packages
          </PrimaryBtn>
        </div>
      </Container>
    </section>
  );
}
