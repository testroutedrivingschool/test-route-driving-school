import Container from "@/app/shared/ui/Container";
import PageHeroSection from "@/app/shared/ui/PageHeroSection";
import React from "react";

export default function PrivacyPolicy() {
  return (
    <>
      <PageHeroSection
        title={`Privacy Policy`}
        subtitle={`Please read these Policy carefully before using our services.`}
      />
      <Container className={`py-16 space-y-5`}>
        <section>
          <h2 className=" text-2xl md:text-4xl font-bold">What is Collected</h2>
          <p className="mt-4  md:text-lg text-neutral">
            Test Route Driving School collects your personal information when
            you use the website and communicate by email or phone. This
            information can include your name, contact information, phone
            numbers and payment information.
          </p>
          <p className="mt-4  md:text-lg text-neutral">
            We may also collect non-personal information such as usage as your
            IP address, browser version, operating system which may be released
            in anonymous form such as a report publishing our website usage
            trends.
          </p>
          <p className="mt-4  md:text-lg text-neutral">
            Any credit card details are processed securely in a PCI compliant
            payment gateway using a secure HTTPS internet connection.
          </p>
          <p className="mt-4  md:text-lg text-neutral">
            Like most websites, Test Route Driving School uses cookies to store
            a user&apos;s website preferences. If you do not wish to have
            cookies placed on your computer, you should set your browser to
            refuse cookies before using our website, with the drawback that
            certain features will not function properly without the aid of
            cookies.
          </p>
        </section>
        <section>
          <h2 className=" text-2xl md:text-4xl font-bold">How it is used</h2>
          <p className="mt-4  md:text-lg text-neutral">
            The personal information that is collected to provide is for
            billing, identification, authentication, service improvement,
            research and website development.
          </p>
          <p className="mt-4  md:text-lg text-neutral">
            Test Route Driving School will not share your personal information
            to anyone except to provide the requested services, develop our
            products, protect our rights, assist with a lawful investigation,
            comply with the law, or to contact you.
          </p>
          <p className="mt-4  md:text-lg text-neutral">
            Some third party service providers such as website hosts, payment
            service providers and backup service providers may have access to
            personal information held by us that a. need to know that
            information in order to process it on behalf of Test Route Driving
            School or to provide services available at the Test Route Driving
            School website and b. have agreed not to disclose it to others.
          </p>
          <p className="mt-4  md:text-lg text-neutral">
            Aggregated non-personal data is collected by Test Route Driving
            School may be shared with third parties in order to improve the Test
            Route Driving School website.
          </p>
        </section>
        <section>
          <h2 className=" text-2xl md:text-4xl font-bold">Social Media</h2>
          <p className="mt-4  md:text-lg text-neutral">
            Test Route Driving School may tag you in a photo on Social Media or
            include your Facebook profile photo if you leave a testimonial. You
            can request for photo to not be displayed or shared.
          </p>
        </section>
        <section>
          <h2 className=" text-2xl md:text-4xl font-bold">
            Business Transfers
          </h2>
          <p className="mt-4  md:text-lg text-neutral">
            If Test Route Driving School was acquired, or in the unlikely event
            that it goes out of business or enters bankruptcy, user information
            would be one of the assets that is transferred or acquired by a
            third party. You acknowledge that such transfers may occur, and that
            any acquirer of Test Route Driving School may continue to use your
            personal information as set forth in this policy.
          </p>
        </section>
        <section>
          <h2 className=" text-2xl md:text-4xl font-bold">
            Privacy Policy Changes
          </h2>
          <p className="mt-4  md:text-lg text-neutral">
            Although most changes are likely to be minor, Test Route Driving
            School may change its Privacy Policy from time to time, and at Test
            Route Driving School sole discretion. We encourage users to
            frequently check this page for any changes to its Privacy Policy.
            Your continued use of this site after any change in this Privacy
            Policy will constitute your acceptance of such change.
          </p>
        </section>
        <section>
          <h3 className="text-xl md:text-3xl font-bold">
            Questions or Complaints
          </h3>
          <p className="mt-2 text-neutral md:text-lg">
            Your privacy is taken seriously. You can contact Test Route Driving
            School anytime at 
            <a
              href="mailto:testroutedrivingschool@gmail.com"
              className="text-primary pl-1"
            >
               testroutedrivingschool@gmail.com
            </a>
            with any questions or complaints regarding how your personal
            information is handled.
          </p>
        </section>
      </Container>
    </>
  );
}
