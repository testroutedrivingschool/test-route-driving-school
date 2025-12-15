"use client";
import {useParams, useRouter} from "next/navigation";
import Container from "@/app/shared/ui/Container";
import {packagesData} from "../packagesData";
import {FiChevronRight} from "react-icons/fi";
import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import Image from "next/image";
import {FaCheckCircle} from "react-icons/fa";
import Link from "next/link";
import PageHeroSection from "@/app/shared/ui/PageHeroSection";

export default function PackageDetails() {
  const params = useParams();
  const router = useRouter();
  const packageId = parseInt(params.id, 10);

  const pkg = packagesData.find((p) => p.id === packageId);

  if (!pkg) {
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
      <PageHeroSection title={`${pkg.name}`} />
      <Container className={``}>
          {/* Back Link */}
        <div className="mt-10">
          <Link href="/packages" className="inline-flex rounded-xl items-center gap-2 bg-primary px-4 py-2 text-white">
            ← Back to Packages
          </Link>
        </div>
        <div className="mt-10 flex flex-col lg:flex-row gap-10">
          {/* Left - Image */}
          <div className="flex-1">
            <Image
              src={pkg.packageImg}
              width={500}
              height={500}
              alt={pkg.name}
              className="rounded-xl shadow-lg w-full"
            />
          </div>

          {/* Right - Details */}
          <div className="flex-1 flex flex-col gap-6">
            <h1 className="text-4xl font-bold text-gray-900">{pkg.name}</h1>
            <p className="text-gray-700 text-lg">{pkg.description}</p>

            {/* Pricing */}
            <div className="flex items-center gap-4 text-gray-900">
              <span className="text-3xl font-bold">${pkg.price}</span>
              <span className="text-lg line-through text-gray-500">
                ${pkg.originalPrice}
              </span>
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-sm">
                Save ${pkg.savings}
              </span>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-xl font-semibold mb-2">Features</h3>
              <ul className="space-y-2">
                {pkg.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 text-gray-700"
                  >
                    <FaCheckCircle className="text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Lessons & Duration */}
            <div className="flex gap-6 text-gray-700">
              <div>
                <span className="font-semibold">{pkg.lessons}</span> Lessons
              </div>
              <div>
                Duration: <span className="font-semibold">{pkg.duration}</span>
              </div>
            </div>
            {/* Book Button */}
            <div>
              <PrimaryBtn
                onClick={() => {
                  // For now, just navigate to contact or booking page
                  router.push("/contact");
                }}
              >
                Book This Package <FiChevronRight className="ml-1" />
              </PrimaryBtn>
            </div>
          </div>
        </div>

      
      </Container>
    </section>
  );
}
