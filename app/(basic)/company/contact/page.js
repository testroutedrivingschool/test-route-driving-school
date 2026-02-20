import Container from "@/app/shared/ui/Container";
import PageHeroSection from "@/app/shared/ui/PageHeroSection";
import Link from "next/link";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebookF,
  FaGoogle,
} from "react-icons/fa";
import ContactForm from "./ContactForm";

export const metadata = {
  title: "Contact Us Today – Book Your Driving Lessons",
  description:
    "Contact Us – Get expert driving lessons across Sydney suburbs. Book your first lesson today and start learning to drive confidently with Test Route Driving School.",
  keywords: [
    "Book a Driving Class",
    "driving classes for adults",
    "Learn driving",
    "Driving lessons",
    "Driving school",
  ],
};

export default function Contact() {

  
  return (
    <>
      <PageHeroSection
        title="Contact Us Today – Book Your Driving Lessons"
        subtitle={
          <>
            Have questions or ready to start your driving journey? At{" "}
            <Link className="font-semibold underline px-1" href={`/`}>
              Test Route Driving School,
            </Link>{" "}
            we make it easy for you to{" "}
            <Link
              className="font-semibold underline px-1"
              href={`/company/contact`}
            >
              {" "}
              book a driving class
            </Link>{" "}
            and start learning confidently. Whether you are a teen learner, a
            young professional, or an adult seeking a license, our team is here
            to guide you every step of the way.
          </>
        }
      />
      <section className="py-16 ">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LEFT INFO */}
            <div className="flex-1 md:pl-6 space-y-8">
              {/* Heading */}
              <div>
                <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">
                  Get in Touch with
                  <span className="text-primary px-1">
                    Test Route Driving School
                  </span>
                </h2>
                <p className="text-neutral mt-2 max-w-md">
                  Are you ready to <strong>learn driving</strong> or want to
                  enrol in <strong>driving classes for adults? </strong>Reach
                  out to us anytime. Our friendly instructors are here to answer
                  your questions and help you schedule your
                  <Link className="font-semibold underline px-1" href={`/services/automatic-driving-lessons`}>
                    driving lessons
                  </Link>
                  around your busy life.
                </p>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <a
                  href="tel:61412018593"
                  className="flex items-center gap-4 px-4 rounded-lg  text-primary font-bold text-lg md:text-xl transition hover:underline"
                >
                  <FaPhoneAlt className="text-xl" />
                  <span>0412 018 593</span>
                </a>

                <a
                  href="mailto:testroutedrivingschool@gmail.com"
                  className="flex items-center gap-4 px-4 rounded-lg  text-primary font-bold text-lg md:text-xl transition hover:underline"
                >
                  <FaEnvelope className="text-xl" />
                  <span>testroutedrivingschool@gmail.com</span>
                </a>
              </div>

              {/* Location */}
              <div className="bg-white rounded-xl shadow p-6">
                <h4 className="font-bold text-xl mb-3">Head Office</h4>

                <div className="flex items-start gap-3 text-gray-700 mb-4">
                  <FaMapMarkerAlt className="text-primary text-xl mt-1" />
                  <p className="leading-relaxed">
                    <span className="font-semibold">
                      Test Route Driving School
                    </span>
                    <br />
                    67 Warialda St, Kogarah NSW 2217
                    <br />
                    Australia
                  </p>
                </div>

                {/* Map */}
                <div className="overflow-hidden rounded-lg ">
                  <iframe
                    className="w-full h-64 "
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3309.1921998148187!2d151.1289021!3d-33.9618991!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12b99c02de074f%3A0x95b44233fd6b6d18!2sTest%20Route%20Driving%20School!5e0!3m2!1sen!2sbd!4v1766326342009!5m2!1sen!2sbd"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-white rounded-xl shadow p-6">
                <h4 className="font-bold text-xl mb-4">Follow Us</h4>

                <div className="flex gap-4">
                  <a
                    href="https://www.facebook.com/share/1A148kMS7g/"
                    target="_blank"
                    className="w-11 h-11 flex items-center justify-center rounded-full bg-primary text-white hover:scale-110 transition"
                  >
                    <FaFacebookF />
                  </a>

                  <a
                    href="https://share.google/TEMTklcOBslyY7zBC"
                    target="_blank"
                    className="w-11 h-11 flex items-center justify-center rounded-full bg-primary text-white hover:scale-110 transition"
                  >
                    <FaGoogle />
                  </a>
                </div>
              </div>
            </div>

            {/* RIGHT FORM */}
            <ContactForm/>
          </div>
        </Container>
      </section>
    </>
  );
}
