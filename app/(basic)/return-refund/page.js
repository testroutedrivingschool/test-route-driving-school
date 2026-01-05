import Container from "@/app/shared/ui/Container";
import PageHeroSection from "@/app/shared/ui/PageHeroSection";
import React from "react";

export default function ReturnAndRefundPolicy() {
  return (
    <>
      <PageHeroSection
        title={`Return and Refund`}
        subtitle={`Please read these terms carefully before booking your lessons.`}
      />

      <Container className={`py-16 space-y-10`}>
        {/* Refund Policy */}
        <section>
          <h3 className="text-xl md:text-3xl font-bold">Refund Policy</h3>
          <p className="mt-2 text-neutral md:text-lg">
            At Test Route Driving School, we aim to ensure a smooth and
            satisfactory experience for all our students. Refunds will only be
            issued under the following circumstances:
          </p>
          <ul className="list-disc ml-5 mt-3 space-y-2 text-neutral md:text-lg">
            <li>
              If a lesson is cancelled by the instructor or the school, a full
              refund will be provided.
            </li>
            <li>
              Refund requests must be submitted at least 24 hours before the
              scheduled lesson for eligible cancellation.
            </li>
            <li>
              Refunds are not available for lessons that have already been
              completed.
            </li>
            <li>
              Refunds for packages will be prorated based on lessons already
              attended.
            </li>
          </ul>
        </section>

        {/* Return Policy */}
        <section>
          <h3 className="text-xl md:text-3xl font-bold">Return Policy</h3>
          <p className="mt-2 text-neutral md:text-lg">
            As our services involve driving lessons and assessments, we do not
            accept returns of services once booked and confirmed. However, we
            provide flexibility to reschedule lessons under the following
            conditions:
          </p>
          <ul className="list-disc ml-5 mt-3 space-y-2 text-neutral md:text-lg">
            <li>
              Lessons can be rescheduled up to 24 hours before the scheduled
              time.
            </li>
            <li>
              Rescheduling is subject to instructor availability.
            </li>
            <li>
              Rescheduled lessons must be completed within the validity period
              of the purchased package.
            </li>
          </ul>
        </section>

        {/* How to Request a Refund */}
        <section>
          <h3 className="text-xl md:text-3xl font-bold">How to Request a Refund</h3>
          <p className="mt-2 text-neutral md:text-lg">
            To request a refund, please follow these steps:
          </p>
          <ol className="list-decimal ml-5 mt-3 space-y-2 text-neutral md:text-lg">
            <li>Contact our support team at <a href="mailto:testroutedrivingschool@gmail.com" className="text-accent underline">testroutedrivingschool@gmail.com</a> or call +61 412 018 593.</li>
            <li>Provide your booking details, including your name, email, and scheduled lesson.</li>
            <li>Explain the reason for your refund request.</li>
            <li>Our team will review your request and notify you of the outcome within 3 business days.</li>
          </ol>
        </section>

        {/* Important Notes */}
        <section>
          <h3 className="text-xl md:text-3xl font-bold">Important Notes</h3>
          <ul className="list-disc ml-5 mt-3 space-y-2 text-neutral md:text-lg">
            <li>All refunds will be processed using the original payment method.</li>
            <li>We reserve the right to deny refund requests that do not meet our policy guidelines.</li>
            <li>This policy applies to all students and all packages offered by Test Route Driving School.</li>
          </ul>
        </section>
      </Container>
    </>
  );
}
