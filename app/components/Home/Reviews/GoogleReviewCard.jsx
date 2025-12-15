"use client";

import Image from "next/image";
import googleLogo from "@/app/assets/google-logo.webp";
import {FaStar, FaExternalLinkAlt} from "react-icons/fa";
import Container from "@/app/shared/ui/Container";

export default function GoogleReviewCard() {
  return (
    <section className="pt-16 mt-5 md:mt-10">
      <Container>
        <a
          href="https://g.page/r/YOUR_GOOGLE_MAPS_REVIEW_LINK"
          target="_blank"
          rel="noopener noreferrer"
          className="group block w-full "
        >
          <div className="bg-base-300 border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              {/* Left Section - Google Logo & Info */}
              <div className="flex items-center gap-5">
                {/* Google Logo Container */}
                <div className="relative">
               
                  <div className="relative bg-white p-4 rounded-2xl shadow-md border border-gray-100">
                    <div className="flex items-center gap-2">
                      <Image
                        src={googleLogo}
                        width={50}
                        height={50}
                        alt="Google Logo"
                      />
                      <span className="font-bold text-gray-900 text-lg">
                        Google <br />
                        Reviews
                      </span>
                    </div>
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
                      <span className="text-sm text-gray-600 mt-1">
                        Excellent
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-600">
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
                  <span className="font-semibold">View all reviews</span>
                  <FaExternalLinkAlt className="text-sm" />
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-2 w-20 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{width: "90%"}}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">98% positive</span>
                </div>
              </div>
            </div>

            

           
          </div>
        </a>
      </Container>
    </section>
  );
}
