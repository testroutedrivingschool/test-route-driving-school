"use client";

import Image from "next/image";
import googleLogo from "@/app/assets/google-logo.webp";
import {FaStar, FaExternalLinkAlt} from "react-icons/fa";
import Container from "@/app/shared/ui/Container";

export default function GoogleReviewCard() {
  return (
    <section className="pt-10">
      <Container>
        {/* MOBILE VERSION */}
        <div className="md:hidden bg-base-300 border border-gray-200 rounded-xl px-4 py-3">
          <a
            href="https://g.page/r/CRhta_0zQrSVEBE/review"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between"
          >
            {/* Left */}
            <div className="flex gap-4">

          
            <Image src={googleLogo} width={42} height={42} alt="Google" />
            <div className="">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-sm text-gray-800">
                  Google Reviews
                </span>
              </div>
              {/* Middle */}
              <div className="flex items-center gap-1">
                <span className="font-bold">5.0</span>

                <div className="ml-2 flex text-yellow-500 text-sm">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
              </div>
            </div>
  </div>
            {/* Divider */}
            <div className="h-6 w-px bg-gray-300"></div>

            {/* Right */}
            <div className="text-sm font-semibold text-gray-800">
              Reviews: <br/> 800+
            </div>
          </a>
        </div>

        {/* DESKTOP VERSION */}
        <div className="hidden md:block">
          <div className="bg-base-300 border border-gray-200 rounded-xl p-4 md:p-6 shadow transition-all duration-300 hover:-translate-y-1">
            <a
              href="https://g.page/r/CRhta_0zQrSVEBE/review"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col sm:flex-row items-center justify-between gap-6"
            >
              {/* Left Section - Google Logo & Info */}
              <div className="flex items-center gap-5">
                {/* Google Logo Container */}
                <div className="relative">
                  <div className="relative bg-white p-4 rounded-2xl shadow-md border border-gray-100">
                    <div className="flex flex-col md:flex-row items-center gap-2">
                      <Image
                        src={googleLogo}
                        width={50}
                        height={50}
                        alt="Google Logo"
                        className="w-8 h-8"
                      />
                      <span className="text-center md:text-left font-bold text-gray-900 text-sm md:text-lg">
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
                      <span className="text-sm text-neutral mt-1">
                        Excellent
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-neutral">
                    <span className="text-sm font-bold bg-gray-100 px-1 py-1 rounded-full">
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
                  <span className="font-semibold">Write Review</span>

                  <FaExternalLinkAlt className="text-sm" />
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-2 w-20 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{width: "100%"}}
                    ></div>
                  </div>
                  <span className="text-sm text-neutral">100% positive</span>
                </div>
              </div>
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
