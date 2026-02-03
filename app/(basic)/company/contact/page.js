import Container from "@/app/shared/ui/Container";
import PageHeroSection from "@/app/shared/ui/PageHeroSection";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebookF,
  FaGoogle,
} from "react-icons/fa";

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
            <strong>Test Route Driving School,</strong> we make it easy for you
            to <strong>book a driving class</strong> and start learning
            confidently. Whether you are a teen learner, a young professional,
            or an adult seeking a license, our team is here to guide you every
            step of the way.
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
                <p className="text-gray-600 mt-2 max-w-md">
                  Are you ready to <strong>learn driving</strong> or want to
                  enrol in <strong>driving classes for adults? </strong>Reach
                  out to us anytime. Our friendly instructors are here to answer
                  your questions and help you schedule your{" "}
                  <strong>driving lessons</strong> around your busy life.
                </p>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <a
                  href="tel:61412018593"
                  className="flex items-center gap-4 px-4 rounded-lg  text-primary font-bold text-lg md:text-xl transition hover:underline"
                >
                  <FaPhoneAlt className="text-xl" />
                  <span>412 018 593</span>
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
            <form className="flex-1 space-y-4">
              {/* Name */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name *"
                  className="p-4 rounded outline-none border-2 border-border-color focus:border-primary"
                />
                <input
                  type="text"
                  placeholder="Last Name *"
                  className="p-4 rounded outline-none border-2 border-border-color focus:border-primary"
                />
              </div>

              {/* Postcode & Contact */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Postcode *"
                  className="p-4 rounded outline-none border-2 border-border-color focus:border-primary"
                />
                <input
                  type="text"
                  placeholder="Contact Number *"
                  className="p-4 rounded outline-none border-2 border-border-color focus:border-primary"
                />
              </div>

              {/* Email */}
              <input
                type="email"
                placeholder="Email *"
                className="p-4 rounded outline-none border-2 border-border-color focus:border-primary w-full"
              />

              {/* Radio */}
              <div>
                <p className="font-semibold mb-2">
                  Manual/Automatic Driving Lesson or Become a Driving Instructor
                  *
                </p>
                <div className="space-y-1 text-gray-600">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="lesson" /> Manual
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="lesson" /> Automatic
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="lesson" /> Become a Driving
                    Instructor
                  </label>
                </div>
              </div>

              {/* Message */}
              <textarea
                placeholder="Your Message *"
                rows="4"
                className="p-4 rounded outline-none border-2 border-border-color focus:border-primary w-full"
              ></textarea>
              <p className="font-semibold mb-2">How Did You Find Us?</p>
              {/* Dropdown */}
              <select className="p-4 rounded outline-none border-2 border-border-color focus:border-primary w-full">
                <option>Please Choose...</option>
                <option>Google</option>
                <option>Facebook</option>
                <option>Friend</option>
              </select>

              {/* Checkbox */}
              <label className="flex items-start gap-2 text-sm text-gray-600">
                <input type="checkbox" />I agree to receiving other offers from
                time to time.
              </label>

              {/* Button */}
              <button
                type="submit"
                className="bg-primary text-white px-6 py-2 rounded hover:bg-red-700 transition"
              >
                SEND MESSAGE
              </button>
            </form>
          </div>
        </Container>
      </section>
    </>
  );
}
