"use client";
import {useParams, useRouter} from "next/navigation";

import {FiChevronRight} from "react-icons/fi";
import Image from "next/image";
import {FaCheckCircle} from "react-icons/fa";
import Link from "next/link";
import Container from "@/app/shared/ui/Container";
import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import PageHeroSection from "@/app/shared/ui/PageHeroSection";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import { addToCartLS } from "@/app/utils/cart";
import Skeleton from "@/app/shared/ui/Skelton";

export default function PackageDetails() {
  
  const {slug} = useParams();
  const router = useRouter();
  const {data: singlePackage = [], isLoading} = useQuery({
    queryKey: ["package",slug],
    queryFn: async () => {
     const res = await axios.get("/api/packages", { params: { slug } });
      return res.data;
    },
  });
  
  const handleAddToCart = (pkg, e) => {
    e.preventDefault();


    addToCartLS(pkg);
    router.push("/cart");
  };
  if (isLoading) {
    return <Skeleton />;
  }

  if (!singlePackage) {
    return (
      <Container>
        <div className="text-center py-20">
          <h2 className="text-3xl font-bold mb-4">Package Not Found</h2>
          <p className="text-neutral mb-6">
            Sorry, the package you are looking for does not exist.
          </p>
          <Link href="/packages">
            <PrimaryBtn>
              Back to Packages <FiChevronRight />
            </PrimaryBtn>
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <section className="pb-16">
      <PageHeroSection
        title={`${singlePackage.name}`}
        subtitle={`${singlePackage.description}`}
      />
      <Container className={``}>
        {/* Back Link */}
        <div className="mt-10">
          <Link
            href="/packages"
            className="inline-flex rounded-xl items-center gap-2 bg-primary px-4 py-2 text-white"
          >
            ← Back to Packages
          </Link>
        </div>
        <div className="mt-10 flex flex-col lg:flex-row  gap-10">
          {/* Left - Image */}
          <div className="flex-1 h-[420px] lg:h-[520px]">
            <Image
              src={singlePackage.packageThumbline || "/pkg.png"}
              width={1000}
              height={1000}
              alt={singlePackage.name}
              className="rounded-xl shadow w-full h-full object-cover"
               onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentElement.innerHTML = `<img src="/pkg.png" width="100" height="100" className="h-10 w-10 object-cover border ring-2 text-gray-500" />`;
                  }}
            />
          </div>

          {/* Right - Details */}
          <div className="flex-1 flex flex-col gap-6">
            <h1 className="text-4xl font-bold text-gray-900">
              {singlePackage.name}
            </h1>
            <p className="text-gray-700 text-lg">{singlePackage.description}</p>

            {/* Pricing */}
            <div className="flex items-center gap-4 text-gray-900">
              <span className="text-3xl font-bold">${singlePackage.price}</span>
              {singlePackage.originalPrice != 0 &&
                singlePackage.originalPrice && (
                  <span className="text-gray-400 line-through ml-2">
                    ${singlePackage.originalPrice}
                  </span>
                )}
            </div>
            {/* Lessons & Duration */}
            <div className="flex gap-6 text-gray-700">
              <div>
                <span className="font-semibold">
                  Lessons: {singlePackage.lessons}
                </span>{" "}
              </div>
              <div>
                Duration:{" "}
                <span className="font-semibold">{singlePackage.duration}</span>
              </div>
            </div>
            {/* Features */}
            <div>
              <h3 className="text-xl font-semibold mb-2">
                This Package included:
              </h3>
              <ul className="space-y-2">
                {singlePackage.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 text-gray-700"
                  >
                    <FaCheckCircle className="w-5 h-5 shrink-0 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg">Booking instructions</h3>
              <ul className="mt-3 list-inside space-y-1 text-neutral">
                <li>1. Add to Cart</li>
                <li>2. Make Payment</li>
                <li>3. Choose a time that suits you</li>
              </ul>
            </div>
            {/* Book Button */}
            <div>
              <PrimaryBtn onClick={(e) => handleAddToCart(singlePackage, e)}>
                Get This Package <FiChevronRight className="ml-1" />
              </PrimaryBtn>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
