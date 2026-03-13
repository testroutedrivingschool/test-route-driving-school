"use client";
import OutlineBtn from "@/app/shared/Buttons/OutlineBtn";
import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import Container from "@/app/shared/ui/Container";
import SectionHeader from "@/app/shared/ui/SectionHeader";
import {addToCartLS} from "@/app/utils/cart";
import {useRouter} from "next/navigation";
import {FaCheck} from "react-icons/fa";
import {FiChevronRight} from "react-icons/fi";
import {PiSteeringWheel} from "react-icons/pi";

export const packages = [
  {
    _id: "6952e6047fe9723b87c6aafe",
    slug:"/packages/1-hour-lesson",
    name: "1 Hours Lesson Package",
    mobileName: "1 hour Lesson",
    packageThumbline: "/pkg.png",
    description:
      "The 1 Hour Lesson Package is designed to give learner drivers to prepare for their driving test.",
    mobileDescription:
      "All lessons are conducted in a safe and modern dual-controlled vehicle.",
    regularPrice: "",
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
    _id: "695be2ce1f72e6c2fa81e095",
    name: "2 Hours Lesson Package",
       slug:"/packages/2-hours-driving-lesson-package",
    mobileName: "2 hour Lesson",
    packageThumbline: "/pkg.png",
    description:
      "1 Hour × 2 Lessons Package at Test Route Driving School is perfect for learner.",
    mobileDescription:
      "All lessons are conducted in a safe and modern dual-controlled vehicle.",
    regularPrice: "$150",
    price: 140,
    duration: "2 hours",
    features: [
      "Automatic Driving Lesson - 7 days a week",
      "Pick up and drop off at your desired location",
      "One-to-one in-vehicle coaching",
      "Teaching materials are provided",
    ],
  },
  {
    _id: "695bfae01f72e6c2fa81e09d",
    name: "5 Hours Lesson Package",
       slug:"/packages/5-hours-lesson-package",
    mobileName: "5 hour Lesson",
    packageThumbline: "/pkg.png",
    description:
      "1 Hour × 5 Lessons Package at Test Route Driving School is perfect for learner drivers.",
    mobileDescription:
      "All lessons are conducted in a safe and modern dual-controlled vehicle.",
    regularPrice: "$375",
    price: 350,
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
    name: "10 Hours Lesson Package",
       slug:"/packages/10-hours-lesson-pack",
    mobileName: "10 hour Lesson",
    packageThumbline: "/pkg.png",
    description:
      "1 Hour × 10 Lessons Package at Test Route Driving School is perfect for learner drivers.",
    mobileDescription:
      "All lessons are conducted in a safe and modern dual-controlled vehicle.",
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
    <section className="mt-10 bg-base-300 py-8 md:py-16">
      <Container>
        <SectionHeader
          className="mt-5!"
          title="Driving Lesson Packages"
          subtitle="Choose the perfect package for your learning journey. All lessons include certified instructors and modern vehicles."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mt-6 md:mt-10">
          {packages.map((pkg, index) => {
            const saving = pkg.regularPrice
              ? parseInt(pkg.regularPrice.replace("$", "")) -
                parseInt(pkg.price)
              : 0;

            const isFirstPackage = index === 0;

            const handlePackageClick = (e) => {
              if (isFirstPackage) {
                e.preventDefault();
                router.push("/bookings");
              } else {
                handleAddToCart(pkg, e);
              }
            };

            return (
              <div
                key={pkg._id}
                className={`bg-white rounded-xl shadow-sm border border-border-color overflow-hidden flex-col ${
                  index === packages.length - 1 ? "flex lg:hidden" : "flex"
                }`}
              >
                {pkg.popular && (
                  <div className="hidden md:block bg-accent text-black text-center py-2 text-sm font-semibold">
                    ⭐ Most Popular
                  </div>
                )}

                <div className="p-4 md:p-6 flex-1 flex flex-col">
                  {/* MOBILE CARD */}
                  <div className="block md:hidden">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="shrink-0 w-10 h-10 rounded-full border border-primary/30 flex items-center justify-center text-primary">
                        <PiSteeringWheel size={22} />
                      </div>

                      <div>
                        <h3 className="text-[22px] font-bold text-gray-900 leading-snug">
                          {pkg.mobileName || pkg.name}
                        </h3>
                      </div>
                    </div>

                    <p className="text-[15px] leading-7 text-neutral mb-4">
                      {pkg.mobileDescription || pkg.description}
                    </p>

                    <div className="mb-5">
                      <div className="flex items-end gap-2">
                        <span className="text-4xl font-bold text-primary">
                          ${pkg.price}
                        </span>
                        {pkg.regularPrice && (
                          <span className="text-base text-gray-400 line-through mb-1">
                            {pkg.regularPrice}
                          </span>
                        )}
                      </div>

                      {pkg.regularPrice ? (
                        <div className="mt-2 text-base font-semibold ">
                          Save <br />
                          <span className="font-bold text-2xl text-green-700">
                            ${saving}
                          </span>
                        </div>
                      ) : (
                        "-"
                      )}
                    </div>
                    <div className="flex gap-3">
                      <PrimaryBtn
                        onClick={handlePackageClick}
                        className=" px-2! md:px-4 py-2 md:py-3  text-sm! md:text-base"
                      >
                        <span className="flex items-center justify-center gap-2 font-semibold">
                          Get This Package
                        </span>
                      </PrimaryBtn>
                      <OutlineBtn onClick={()=>router.push(pkg.slug)} className={`px-2! md:px-4 py-2 md:py-3  text-sm! md:text-base`}>View Details</OutlineBtn>
                    </div>
                  </div>

                  {/* DESKTOP CARD */}
                  <div className="hidden md:flex flex-1 flex-col">
                    <div className="mb-6">
                      <div className="flex justify-between gap-2 items-start mb-2">
                        <h3 className="text-lg md:text-2xl font-bold text-gray-900">
                          {pkg.name}
                        </h3>
                        <span className="w-18 md:w-24 text-center text-xs md:text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                          {pkg.duration}
                        </span>
                      </div>
                      <p className="text-neutral">{pkg.description}</p>
                    </div>

                    <div className="mb-6 p-4 bg-linear-to-r from-gray-50 to-blue-50 rounded-xl">
                      <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold text-gray-900">
                          ${pkg.price}
                        </span>

                        {pkg.regularPrice && (
                          <span className="text-lg text-gray-500 line-through">
                            {pkg.regularPrice}
                          </span>
                        )}

                        {pkg.regularPrice && (
                          <span className="ml-auto text-sm font-semibold text-green-900 bg-green-50 border border-green-700 px-3 py-1 rounded-full">
                            Save ${saving}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mb-6 flex-1">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        What&apos;s included:
                      </h4>
                      <ul className="space-y-3">
                        {pkg.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <div className="shrink-0 w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                              <FaCheck className="text-primary" size={12} />
                            </div>
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <PrimaryBtn
                      onClick={handlePackageClick}
                      className="mt-auto w-full py-2! md:py-3! group hover:scale-[1.02] transition-transform duration-200"
                    >
                      <span className="flex items-center justify-center gap-2 font-semibold">
                        Get This Package
                        <FiChevronRight className="group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                    </PrimaryBtn>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 md:mt-8 flex justify-center">
          <PrimaryBtn
            onClick={() => router.push("/packages")}
            className="py-2! md:py-4 text-base! md:text-lg"
          >
            View All Packages
          </PrimaryBtn>
        </div>
      </Container>
    </section>
  );
}
