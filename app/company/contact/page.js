import Container from "@/app/shared/ui/Container";
import PageHeroSection from "@/app/shared/ui/PageHeroSection";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebookF,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

export default function Contact() {
  return (
    <>
      <PageHeroSection
        title="Contact Us"
        subtitle="Have questions or ready to start your driving journey? Get in touch with Test Route Driving School and our team will be happy to help."
      />
      <section className="py-16 ">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* LEFT INFO */}
            <div className="flex-1  md:pl-5">
              <h2 className="text-2xl md:text-3xl font-bold">
                Get in Touch with{" "}
                <span className="text-primary"> Test Route Driving School</span>
              </h2>
              <a
                href="tel:61 412 018 593"
                className="flex items-center gap-3 text-primary font-bold text-lg md:text-xl mt-4"
              >
                <FaPhoneAlt />
                <span>61 412 018 593</span>
              </a>

              <a
                href="mailto:testroutedrivingschool@gmail.com"
                className="flex items-center gap-3 text-primary font-bold text-lg md:text-xl mt-2"
              >
                <FaEnvelope />
                <span>testroutedrivingschool@gmail.com</span>
              </a>

              <div>
                <h4 className="font-bold text-lg md:text-xl mb-2 mt-4">
                  Head Office Based at:
                </h4>
                <div className="flex gap-3 text-gray-600">
                  <FaMapMarkerAlt className="mt-1" />
                  <p className="text-lg text-neutral">
                    Test Route Driving School <br />
                    Rockdale NSW <br />
                    Sydney, <br />
                    Australia
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-lg md:text-xl mt-4 mb-3">
                  Social
                </h4>
                <div className="flex gap-4 text-primary text-lg">
                  <a href="https://www.facebook.com" target="_blank">
                    <FaFacebookF />
                  </a>
                  <a href="https://www.x.com" target="_blank">
                    <FaTwitter />
                  </a>
                  <a href="https://www.youtube.com" target="_blank">
                    <FaYoutube />
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
