import Link from "next/link";
import Image from "next/image";
import Container from "@/app/shared/ui/Container";
import PrimaryBtn from "../Buttons/PrimaryBtn";

export default function Footer() {
  const quickLinks = [
    {id: 1, label: "Home", href: "/"},
    {id: 2, label: "Instructors", href: "/instructors"},
    {id: 3, label: "Services", href: "/services"},
    {id: 4, label: "Resources", href: "/resources"},
    {id: 5, label: "Packages", href: "/package"},
    {id: 6, label: "Contact", href: "/contact"},
  ];

  const extraLinks = [
    {id: 1, label: "FAQ", href: "/faq"},
    {id: 2, label: "Terms & Conditions", href: "/terms"},
    {id: 3, label: "Privacy Policy", href: "/privacy"},
  ];

  return (
    <footer className=" bg-secondary text-gray-200 pt-12">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6">
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
            <p className="text-neutral mt-2 max-w-xs">
              Learn to drive with confidence! Certified instructors and modern
              vehicles ensure a safe and effective learning experience.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="flex flex-col gap-2">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className="hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Join & Extra Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Join Us</h3>
            <ul className="flex flex-col gap-2">
              {extraLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className="hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Optional: Call to Action */}
            <div className="mt-6">
              <Link
                href="/become-instructor"
                className="inline-block bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary/90 transition-all duration-300"
              >
                Join as an Instructor
              </Link>
            </div>
          </div>
          {/* Column 4: Newsletter */}
          <div>
            <h3 className="text-white font-semibold mb-4">Newsletter</h3>
            <p className="text-neutral mb-4">
              Subscribe to our newsletter to get the latest updates and driving
              tips.
            </p>
            <form className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 rounded-lg text-white placeholder:text-white w-auto sm:w-auto flex-1 border border-white "
              />
              <div>
                <PrimaryBtn type={"submit"} className="flex-1 sm:w-auto">Subscribe</PrimaryBtn>
              </div>
            </form>
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
