"use client";
import Link from "next/link";
import Image from "next/image";
import Container from "@/app/shared/ui/Container";

import {useUserData} from "@/app/hooks/useUserData";
import LoadingSpinner from "./LoadingSpinner";
import {
  FaEnvelope,
  FaFacebookF,
  FaGoogle,
  FaMapMarkerAlt,
  FaPhoneAlt,
} from "react-icons/fa";

export default function Footer() {
  const {data: userData, isLoading} = useUserData();
  const quickLinks = [
    {id: 1, label: "Home", href: "/"},
    {id: 2, label: "Instructors", href: "/instructors"},
    {id: 3, label: "Services", href: "/services"},
    {id: 4, label: "Packages", href: "/packages"},
    {id: 5, label: "FAQ", href: "/faq"},
    {id: 6, label: "Contact", href: "/company/contact"},
  ];

  const extraLinks = [
    {id: 1, label: "Terms of Service", href: "/terms"},
    {id: 2, label: "Privacy Policy", href: "/privacy"},
    {id: 3, label: "Return & Refund Policy", href: "/return-refund"},
  ];
  if (isLoading) return <LoadingSpinner />;
  return (
    <footer className=" bg-secondary text-gray-200 pt-12 pb-4">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-6">
          {/* Column 1: Logo + Description */}
          <div className="flex flex-col items-start gap-3">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/test-route-driving-school-logo.png"
                alt="Test Route Driving School Logo"
                width={60}
                height={60}
                className="rounded-full object-contain"
              />
              <div>
                <h2 className="text-white font-bold text-lg">Test Route</h2>
                <h2 className="text-white font-black text-lg">
                  Driving School
                </h2>
              </div>
            </Link>
            <p className="text-gray-300 mt-2 max-w-xs">
              Start your driving journey today with a trusted driving school in
              Kogarah. Our friendly instructors are ready to help you gain
              confidence, master driving skills, and pass your test.
            </p>

          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg md:text-xl">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className="hover:text-accent transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Join & Extra Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg md:text-xl">
              Company Policies
            </h3>
            <ul className="flex flex-col gap-2">
              {extraLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className="hover:text-accent transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            {(!userData || userData.role === "user") && (
              <div className="mt-6">
                <Link
                  href="/become-instructor"
                  className="inline-block bg-accent text-white font-semibold px-6 py-3 rounded-xl hover:bg-accent/90 transition-all duration-300"
                >
                  Join as an Instructor
                </Link>
              </div>
            )}
          </div>
          {/* Column 4: Newsletter */}
          <div>
            <div className="">
              <h4 className="font-bold text-lg md:text-xl mb-2">
                Contact Info
              </h4>

              <ul className="flex flex-col gap-2 text-white text-base font-medium">
                <li className="flex items-center gap-2">
                  <a
                    className="flex items-center gap-2"
                    href="tel: +61 412 018 593"
                  >
                    {" "}
                    <FaPhoneAlt size={22} className="text-accent" />
                    <span> 0412 018 593</span>
                  </a>
                </li>

                <li className="flex items-center gap-2">
                  <a
                    className="flex items-center gap-2"
                    href="mailto:testroutedrivingschool@gmail.com"
                  >
                    <FaEnvelope size={22} className="text-accent" />
                    <span className="break-all">
                      testroutedrivingschool@gmail.com
                    </span>
                  </a>
                </li>

                <li className="flex items-center gap-2">
                  <FaMapMarkerAlt size={22} className="text-accent" />
                  <span>67 Warialda St, Kogarah NSW 2217, Australia</span>
                </li>
              </ul>
              <div className="mt-4">
                <h4 className="font-bold text-lg mb-2">Follow Us</h4>

                <div className="flex gap-4">
                  <a
                    href="https://www.facebook.com/share/1A148kMS7g/"
                    target="_blank"
                     aria-label="Visit Test Route Driving School on Facebook"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-accent text-white hover:scale-110 transition"
                  >
                    <FaFacebookF />
                  </a>

                  <a
                    href="https://share.google/TEMTklcOBslyY7zBC"
                    target="_blank"
                     aria-label="Visit Test Route Driving School on Google"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-accent text-white hover:scale-110 transition"
                  >
                    <FaGoogle />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white mt-10"></div>

        {/* Copyright */}
        <p className="text-center text-white text-sm mt-6">
          © Test Route Driving School. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
