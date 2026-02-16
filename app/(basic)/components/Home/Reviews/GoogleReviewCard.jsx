"use client";

import Image from "next/image";
import googleLogo from "@/app/assets/google-logo.webp";
import {FaStar, FaExternalLinkAlt} from "react-icons/fa";
import Container from "@/app/shared/ui/Container";

export default function GoogleReviewCard() {
  return (
    <section className="pt-16 mt-5 md:mt-10">
      <Container>
        <div>
          <div className="bg-base-300 border border-gray-200 rounded-xl p-6 shadow transition-all duration-300 hover:-translate-y-1">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              {/* Left Section - Google Logo & Info */}
              <div className="flex items-center gap-5">
                {/* Google Logo Container */}
                <div className="relative">
                  <div className="relative bg-white p-4 rounded-2xl shadow-md border border-gray-100">
                    <a
                      href="https://share.google/TEMTklcOBslyY7zBC"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col md:flex-row items-center gap-2"
                    >
                      <Image
                        src={googleLogo}
                        width={50}
                        height={50}
                        alt="Google Logo"
                      />
                      <span className="text-center md:text-left font-bold text-gray-900 text-lg">
                        Google <br />
                        Reviews
                      </span>
                    </a>
                  </div>
                </div>

                {/* Rating Information */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-4xl font-bold text-gray-900">5.0</div>
                    <div className="flex flex-col">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className="text-yellow-500 text-lg" />
                        ))}
                      </div>
                      <span className="text-sm text-neutral mt-1">
                        Excellent
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-neutral">
                    <span className="text-sm font-bold bg-gray-100 px-3 py-1 rounded-full">
                      850+ reviews
                    </span>
                    <span className="text-xs">
                      • Based on community feedback
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Section - CTA */}
              <div className="flex flex-col items-center sm:items-end gap-3">
                <div className="flex items-center gap-2 text-primary group-hover:text-accent transition-colors">
                  <a
                    href="https://www.google.com/search?sca_esv=5fc6a171bfa3a3e8&hl=en-GB&authuser=0&sxsrf=AE3TifPK0Mko7YFINptTagHfiaasORtKuA:1766995600014&kgmid=/g/11ml2bbpd7&q=Test+Route+Driving+School&shndl=30&shem=ptotplc,shrtsdl&source=sh/x/loc/uni/m1/1&kgs=0c22e48646a44d9c&utm_source=ptotplc,shrtsdl,sh/x/loc/uni/m1/1#lrd=0x6b12b99c02de074f:0x95b44233fd6b6d18,3,,,,"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block w-full "
                  >
                    <span className="font-semibold">Write Review</span>
                  </a>
                  <FaExternalLinkAlt className="text-sm" />
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-2 w-20 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{width: "90%"}}
                    ></div>
                  </div>
                  <span className="text-sm text-neutral">98% positive</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
