import Container from "@/app/shared/ui/Container";
import PageHeroSection from "@/app/shared/ui/PageHeroSection";
import React from "react";

export default function TermsAndConditions() {
  return (
    <>
      <PageHeroSection
        title={`Terms of Service`}
        subtitle={`Please read these terms carefully before using our services.`}
      />
      <Container className={`py-16 space-y-5`}>
        <section>
          <h2 className=" text-2xl md:text-4xl font-bold">Terms of Service</h2>
          <p className="mt-4  md:text-lg text-neutral">
            By using this website (&quot;Service&quot;) you are agreeing to be
            bound by the following terms and conditions (&quot;Terms of
            Service&quot;) with Test Route Driving School - ABN: 60 328 717 194.
            <br />
            Test Route Driving School reserves the right to update and change
            the Terms of Service without notice.
          </p>
        </section>
        <section>
          <h3 className="text-xl md:text-3xl font-bold">
            Terms of using instructor vehicle for driving test:
          </h3>
          <p className="mt-4 text-neutral md:text-lg">
            Learner acknowledges that by asking for, and participating in a
            driving test, Learner is responsible for:
          </p>
          <ul className="mt-2 text-neutral md:text-lg space-y-3">
            <li>
              1. all damage to the vehicle if I am &ldquo;at fault&quot; or
              cannot identify nor have details of the person &quot;at
              fault&quot;
            </li>
            <li>2. damage that is caused by the vehicle in my control.</li>
            <li>3. theft or loss of the vehicle</li>
            <li>
              4. all fines, regardless of when issued by the relevant authority
              during the driving test.
            </li>
          </ul>
          <p className="mt-4 text-neutral md:text-lg">
            Furthermore, Learner state that in such an event, Learner will pay
            for the costs of repairs to the vehicle &/or property collided with,
            subject to the renter of 2 agreed quotes including...
          </p>
          <ul className="mt-2 text-neutral md:text-lg space-y-3">
            <li>1. actual cost of repair</li>
            <li>2. any towing fees</li>
            <li>3. any excesses ($1,400)</li>
            <li>4. any fines</li>
          </ul>
          <p className="mt-2 text-neutral md:text-lg">
            In the case of a catastrophic incident where the cost to repair, is
            greater than the excess fees, Learner will pay within 14 days.
          </p>
        </section>
        <section>
          <h3 className="text-xl md:text-3xl font-bold">Account Terms</h3>
          <p className="mt-2 text-neutral md:text-lg">
            This page contains the most current version of the Terms of Service.
          </p>
          <ul className="mt-2 space-y-3 list-disc pl-5 text-neutral md:text-lg">
            <li>
              You agree that Test Route Driving School can send you booking
              reminders, relevant information and other marketing via phone, SMS
              and/or email. You can opt out of any marketing.
            </li>
            <li>
              You are responsible for maintaining the security of your account
              and password. Test Route Driving School cannot and will not be
              liable for any loss or damage from your failure to comply with
              this security obligation.
            </li>
            <li>
              By purchasing from Test Route Driving School, you agree not to
              initiate any credit card chargeback, or dispute any payment made
              for services, products, digital goods, Vouchers or gift cards
              purchased, except in cases of proven fraud or unauthorized
              transactions. All disputes must be resolved directly with Right
              Choice Driving School.
            </li>
            <li>
              You must not post or submit false information to the Service.
            </li>
            <li>
              You must not use the Service for any illegal or unauthorised
              purpose. You must not use this Service to violate any laws in your
              jurisdiction, including but not limited to copyright laws.
            </li>
            <li>
              You are responsible for all activity that occurs from your
              account.
            </li>
            <li>
              Accounts registered by &quot;bots&quot; or other automated methods
              are not permitted and will be removed.
            </li>
            <li>
              Test Route Driving School has the right to suspend or terminate
              your account, refuse any current or future use of the Service, or
              any other Test Route Driving School service, for any reason.
            </li>
            <li>
              Violation of any of the terms or general conditions may result in
              the termination of your Account.
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl md:text-3xl font-bold">Cancellation Rates</h3>
          <p className="mt-2 space-y-3 list-disc  text-neutral md:text-lg">
            Less than 24 hours notice before the booking will forfeit the full
            booking fee.
          </p>
          <p className="mt-2 space-y-3   text-neutral md:text-lg">
            A cancellation does not automatically refund payment of products or
            services. Any amount not subject to the cancellation fee, is
            credited towards your account balance at Test Route Driving School.
          </p>
        </section>

        <section>
          <h3 className="text-xl md:text-3xl font-bold">Refund Policy</h3>
          <p className="mt-2 space-y-3 text-neutral md:text-lg">
            All refunds must be resolved directly with Test Route Driving
            School.
          </p>
        </section>

        <section>
          <h3 className="text-xl md:text-3xl font-bold">
            Modifications to Services and Prices
          </h3>

          <ul className="mt-2 space-y-3 list-disc pl-5 text-neutral md:text-lg">
            <li>
              Test Route Driving School reserves the right at any time and
              from time to time to modify or discontinue, temporarily or
              permanently, the Service (or any part thereof) with or without
              notice.
            </li>
            <li>
              Prices of all Services are subject to change with or without
              notice.
            </li>

            <li>
              Test Route Driving School shall not be liable to you or to any
              third party for any modification, price change, suspension or
              discontinuance of the Service.
            </li>
          </ul>
        </section>
        <section>
          <h3 className="text-xl md:text-3xl font-bold">Vouchers</h3>
          <ul className="mt-2 space-y-3 list-disc pl-5 text-neutral md:text-lg">
            <li>
              Vouchers are non-refundable and cannot be redeemed for cash.
            </li>
            <li>Unused vouchers cannot be transferred between clients.</li>
          </ul>
        </section>
        <section>
          <h3 className="text-xl md:text-3xl font-bold">Fees</h3>
          <ul className="mt-2 space-y-3 list-disc pl-5 text-neutral md:text-lg">
            <li>
              Credit card security is implemented using secure SSL encryption on
              all transactions and processed using a secure, trusted, PCI
              compliant payment gateway and used by Test Route Driving School
              for payment processing.
            </li>
            <li>All fees and transactions are in Australian Dollars.</li>
          </ul>
        </section>
        <section>
          <h3 className="text-xl md:text-3xl font-bold">General Conditions</h3>
          <ul className="mt-2 space-y-3 list-disc pl-5 text-neutral md:text-lg">
            <li>
              Your use of this website is at your sole risk. The website is
              provided on an &quot;as is&quot; and &quot;as available&quot;
              basis.
            </li>
            <li>
              You agree not to reproduce, duplicate, copy, sell, resell or
              exploit any portion of the website, use of the website, or access
              to the website without the express written permission by Right
              Choice Driving School.
            </li>
            <li>
              Verbal, physical, written or other abuse (including threats of
              abuse or retribution) of any Test Route Driving School customer,
              employee, member, instructor, officer or external contractor will
              result in immediate account termination.
            </li>
            <li>
              You must not transmit any worms or viruses or any code of a
              destructive nature.
            </li>
            <li>
              You understand that Test Route Driving School uses third party
              vendors and hosting partners to provide the necessary hardware,
              software, networking, storage, and related technology required to
              run.
            </li>
            <li>
              Test Route Driving School does not warrant that (i) the website
              will meet your specific requirements, (ii) the website will be
              uninterrupted, timely, secure, or error-free, (iii) the results
              that may be obtained from the use of the website will be accurate
              or reliable, (iv) the quality of any products, websites,
              information, or other material purchased or obtained by you
              through the website will meet your expectations, and (v) any
              errors in the website will be corrected.
            </li>
            <li>
              You expressly understand and agree that Test Route Driving
              School shall not be liable for any direct, indirect, incidental,
              special, consequential or exemplary damages, including but not
              limited to, damages for loss of profits, goodwill, use, data or
              other intangible losses (even if Test Route Driving School has
              been advised of the possibility of such damages), resulting from:
              (i) the use or the inability to use the website; (ii) the cost of
              procurement of substitute goods and services resulting from any
              goods, data, information or services purchased or obtained or
              messages received or transactions entered into through or from the
              website; (iii) unauthorised access to or alteration of your
              transmissions or data; (iv) statements or conduct of any third
              party on the website; (v) or any other matter relating to the
              website.
            </li>
            <li>
              The failure of Test Route Driving School to exercise or enforce
              any right or provision of the Terms of website shall not
              constitute a waiver of such right or provision.
            </li>
          </ul>
        </section>
        <section>
          <h3 className="text-xl md:text-3xl font-bold">Questions</h3>
          <p className="mt-2 text-neutral md:text-lg">
            Please send any questions or comments about these Terms of Service
            to{" "}
            <a
              href="mailto:testroutedrivingschool@gmail.com"
              className="text-primary pl-1"
            >
              testroutedrivingschool@gmail.com
            </a>
          </p>
        </section>
      </Container>
    </>
  );
}
