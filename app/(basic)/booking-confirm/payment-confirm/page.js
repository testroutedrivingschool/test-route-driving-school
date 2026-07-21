"use client";

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {loadStripe} from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  CardNumberElement,
} from "@stripe/react-stripe-js";
import axios from "axios";
import Container from "@/app/shared/ui/Container";
import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import {toast} from "react-toastify";
import StripeCardInput from "@/app/shared/ui/StripeCardInput";
import Link from "next/link";
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_Stripe_Publishable_key,
);
const DRIVING_TEST_LOCATIONS = [
  "Bankstown",
  "Bathurst",
  "Blacktown",
  "Bondi",
  "Bondi Junction",
  "Botany",
  "Castle Hill",
  "Chatswood",
  "Eastgarden",
  "Edmondson Park",
  "Engadine",
  "Glenmore Park",
  "Gregory Hills",
  "Lidcombe",
  "Liverpool",
  "Macquarie Fields",
  "Macquarie Park",
  "Marrickville",
  "Merrylands",
  "Miranda",
  "North Rocks",
  "North Ryde",
  "Parramatta",
  "Penrith",
  "Revesby",
  "Rhodes",
  "Richmond",
  "Rockdale",
  "Roseland",
  "Ryde",
  "Silverwater",
  "St. Marys",
  "Warrawong",
  "Wetherill Park",
];
export default function PaymentConfirmPage() {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  );
}

function calculateStripeTotal(baseAmount) {
  const STRIPE_PERCENT = 0.017;
  const STRIPE_FIXED = 0.2;
  const GST_RATE = 0.1;

  let totalCents = Math.round(baseAmount * 100);

  while (true) {
    const total = totalCents / 100;

    const stripeFee = total * STRIPE_PERCENT + STRIPE_FIXED;
    const tax = stripeFee * GST_RATE;
    const totalFee = stripeFee + tax;

    const net = total - totalFee;

    // ✅ add buffer to match Stripe rounding
    if (net >= baseAmount + 0.02) {
      return {
        totalAmount: Number(total.toFixed(2)),
        processingFee: Number((total - baseAmount).toFixed(2)),
      };
    }

    totalCents += 1;
  }
}
function PaymentForm() {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();

  const [booking, setBooking] = useState(null);
  const [locations, setLocations] = useState([]);
  const [address, setAddress] = useState("");
  const [suburb, setSuburb] = useState("");
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [accountBalance, setAccountBalance] = useState(0);
  const [useCredit, setUseCredit] = useState(false);

  const [testLocation, setTestLocation] = useState("");
const [testTime, setTestTime] = useState("");
const [bookingRefNo, setBookingRefNo] = useState("");
  /* Load booking */
  useEffect(() => {
    const data = sessionStorage.getItem("pendingBooking");
    if (!data) {
      router.push("/bookings");
      return;
    }
    const bookingData = JSON.parse(data);

    setBooking(bookingData);

    setTestLocation(bookingData.testLocation || "");
setTestTime(bookingData.testTime || "");
setBookingRefNo(bookingData.bookingRefNo || "");
    setAddress(bookingData.clientAddress ?? bookingData.userAddress ?? "");
    setPhone(
      bookingData.clientPhone
        ? bookingData.clientPhone
        : bookingData.userPhone || "",
    );
    setSuburb(
      bookingData.location
        ? bookingData.location
        : bookingData.suburb
          ? bookingData.suburb
          : "",
    );
  }, [router]);

  /* Load suburbs */
  useEffect(() => {
    axios.get("/api/locations?isSort=true").then((res) => {
      setLocations(res.data);
    });
  }, []);
  useEffect(() => {
    if (!booking?.clientId) return;

    axios
      .get(`/api/clients?clientId=${booking.clientId}`)
      .then((res) => {
        const client = Array.isArray(res.data) ? res.data[0] : null;
        setAccountBalance(Number(client?.accountBalance || 0));
      })
      .catch(() => {
        setAccountBalance(0);
      });
  }, [booking?.clientId]);

  if (!booking) return <LoadingSpinner />;
const normalizedServiceName = String(
  booking?.serviceName || "",
)
  .trim()
  .toLowerCase();

const isManualDrivingTestPackage =
  normalizedServiceName === "driving test package" &&
  booking.bookingType === "manual";

const drivingTestPackageDetails =
  isManualDrivingTestPackage
    ? {
        testLocation: testLocation.trim(),
        testTime: testTime.trim(),
        bookingRefNo: bookingRefNo.trim(),
      }
    : {};
  const baseAmount = Number(booking.price || 0);

  const canUseCredit =
  booking.bookingType === "website" || booking.bookingType === "manual";

const creditToUse =
  useCredit && canUseCredit
    ? Math.min(accountBalance, baseAmount)
    : 0;


const remainingAmount = Number((baseAmount - creditToUse).toFixed(2));
const cardBaseAmount = remainingAmount;
  const feeData =
    booking.bookingType === "website" && cardBaseAmount > 0
      ? calculateStripeTotal(cardBaseAmount)
      : {
          totalAmount: cardBaseAmount,
          processingFee: 0,
          stripeFee: 0,
          tax: 0,
          netAmount: cardBaseAmount,
        };

  const totalAmount = feeData.totalAmount;
  const processingFee = feeData.processingFee;

  const handleConfirmPayment = async () => {
    if (!acceptedTerms) {
      toast.error("Please accept the terms and conditions");
      return;
    }
  if (!address.trim() || !suburb) {
  return toast.error(
    "Please complete address details",
  );
}

if (isManualDrivingTestPackage) {
  if (!testLocation.trim()) {
    return toast.error(
      "Please select the test location",
    );
  }

  if (!testTime.trim()) {
    return toast.error(
      "Please enter the test time",
    );
  }

 
}

    setLoading(true);

  
try {
  const clientId = booking?.clientId ? String(booking.clientId) : "";

      // ✅ MANUAL booking => NO payment
      if (booking.bookingType === "manual") {
        if (clientId) {
          await axios.patch(`/api/clients/${clientId}`, {
            address,
            suburb,
            mobile: phone,
          });
        }
const manualPaymentStatus = remainingAmount <= 0 ? "paid" : "unpaid";
const manualPaymentMethod = creditToUse > 0 ? "credit" : "bank";
       await axios.post("/api/bookings", {
  ...booking,
 ...drivingTestPackageDetails,
  // bookingDate: booking.bookingDate,
  // bookingTime: booking.bookingTime,

  address,
  suburb,
  phone,

  price: baseAmount,
  creditToUse,

  totalPaidAmount: creditToUse,
  paidAmount: creditToUse,
  outstanding: remainingAmount,

  processingFee: 0,
  status: "pending",
  paymentStatus: manualPaymentStatus,
  paymentMethod: manualPaymentMethod,
  paymentIntentId: null,
});

        const returnPath =
          booking?.returnPath ||
          (booking?.flowSource === "admin"
            ? "/dashboard/admin/manage-instructors-slots"
            : "/instructor-bookings");
        sessionStorage.removeItem("pendingBooking");
        toast.success("Booking created (Unpaid) ✅");
        router.push(returnPath);
        return;
      } else {
        // ✅ WEBSITE booking => Stripe payment required

    

if (cardBaseAmount <= 0) {
  await axios.post("/api/bookings", {
    ...booking,
    phone,
    address,
    suburb,

    price: baseAmount,
    creditToUse,

    totalPaidAmount: 0,
    paidAmount: baseAmount,
    processingFee: 0,

    paymentIntentId: null,
    status: "pending",
    paymentStatus: "paid",
    paymentMethod: "credit",
  });

  await axios.patch(`/api/users`, {
    email: booking.userEmail,
    address,
    suburb,
    phone,
    clientId,
  });

  sessionStorage.removeItem("pendingBooking");
  toast.success("Booking confirmed using credit 🎉");
  router.push("/dashboard/user/my-bookings");
  return;
}

// ✅ CARD OR PARTIAL CREDIT + CARD
if (!stripe || !elements) {
  toast.error("Payment system is not ready yet");
  return;
}
        if (!stripe || !elements) return;
        
        const cardElement = elements.getElement(CardNumberElement);
        if (!cardElement) {
          toast.error("Card input not ready");
          return;
        }

        // const {data} = await axios.post("/api/create-payment-intent", {
        //   amount: baseAmount,
        // });
        const {data} = await axios.post("/api/create-payment-intent", {
          amount: cardBaseAmount,
        });
        const result = await stripe.confirmCardPayment(data.clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: booking.userName,
              email: booking.userEmail,
              address: {line1: address},
            },
          },
        });

        if (result.error) {
          toast.error(result.error.message);
          return;
        }
      //  const clientId = booking?.clientId ? String(booking.clientId) : "";
        await axios.post("/api/bookings", {
  ...booking,
  phone,
  address,
  suburb,

  price: baseAmount,
  creditToUse,

  totalPaidAmount: data.totalAmount,
  processingFee: data.processingFee,

  paymentIntentId: result.paymentIntent.id,
  status: "pending",
  paymentStatus: "paid",
});
        await axios.patch(`/api/users`, {
          email: booking.userEmail,
          address,
          suburb,
          phone,
          clientId,
        });
        sessionStorage.removeItem("pendingBooking");
        toast.success("Booking confirmed 🎉");
        router.push("/dashboard/user/my-bookings");
      }
   
   } catch (err) {
  console.error("BOOKING ERROR:", err?.response?.data || err);

  toast.error(
    err?.response?.data?.error ||
      err?.response?.data?.details ||
      "Failed to create booking"
  );

    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-gray-50">
      <Container>
        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-md p-4 md:p-6 space-y-6">
          <h2 className="text-2xl font-bold text-center">Confirm Payment</h2>

          {/* Booking Summary */}
          <div className="bg-gray-100 rounded-lg p-4 space-y-1">
           {accountBalance > 0 && canUseCredit && (
              <div className="mt-3 rounded-lg bg-green-50 border border-green-200 p-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={useCredit}
                    onChange={(e) => setUseCredit(e.target.checked)}
                  />
                  <span>
                    Use credit balance: $
                    {Math.min(accountBalance, baseAmount).toFixed(2)}
                  </span>
                </label>
                <p className="text-sm text-gray-600 mt-1">
                  Available credit: ${accountBalance.toFixed(2)}
                </p>
              </div>
            )}

            {creditToUse > 0 && (
              <p>
                <strong>Credit Used:</strong> -${creditToUse.toFixed(2)}
              </p>
            )}

            <p>
              <strong>Pay by Card:</strong> ${cardBaseAmount.toFixed(2)}
            </p>
            <p>
              <strong>Service:</strong> {booking.serviceName}
            </p>
            <p>
              <strong>Booking At:</strong>{" "}
              {new Date(booking.bookingDate).toDateString()} -{" "}
              {booking.bookingTime}
            </p>
            <p>
              <strong>Duration:</strong> {booking.duration}
            </p>
            <p>
              <strong>Price:</strong> ${baseAmount.toFixed(2)}
            </p>
            <p>
              <strong>Card Processing Fee:</strong> ${processingFee.toFixed(2)}
            </p>
            <p className="text-lg font-bold">
              Total:{" "}
              <span className="text-primary">${totalAmount.toFixed(2)}</span>
            </p>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="font-medium">Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="input-class "
              required
            />
          </div>
          {/* Address */}
          <div className="space-y-2">
            <label className="font-medium">Street Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="input-class"
              required
            />
          </div>

          {/* Suburb */}
          <div className="space-y-2">
            <label className="font-medium">Suburb</label>
            <select
              value={suburb}
              onChange={(e) => setSuburb(e.target.value)}
              className="input-class"
              required
            >
              <option value="">Select suburb</option>
              {locations.map((loc) => (
                <option key={loc._id} value={loc.name}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>
          {/* Only for Driving Test Package */}
{isManualDrivingTestPackage && (
  <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-5">
    <h3 className="mb-6 text-xl font-bold text-gray-900">
      Additional Information
    </h3>

    <div className="space-y-4">
      {/* Test Location */}
      <div className="grid grid-cols-1 items-center gap-2 md:grid-cols-[150px_1fr]">
        <label
          htmlFor="testLocation"
          className="font-medium text-gray-900"
        >
          Test Location:
        </label>

       <select
  id="testLocation"
  value={testLocation}
  onChange={(event) =>
    setTestLocation(event.target.value)
  }
  className="input-class"
  required
>
  <option value="">
    Select test location
  </option>

  {DRIVING_TEST_LOCATIONS.map((location) => (
    <option
      key={location}
      value={location}
    >
      {location}
    </option>
  ))}
</select>
      </div>

      {/* Test Time */}
      <div className="grid grid-cols-1 items-center gap-2 md:grid-cols-[150px_1fr]">
        <label
          htmlFor="testTime"
          className="font-medium text-gray-900"
        >
          Test Time:
        </label>

        <input
          id="testTime"
          type="time"
          value={testTime}
          onChange={(event) =>
            setTestTime(
              event.target.value,
            )
          }
          className="input-class"
          required
        />
      </div>

      {/* Booking reference */}
      <div className="grid grid-cols-1 items-center gap-2 md:grid-cols-[150px_1fr]">
        <label
          htmlFor="bookingRefNo"
          className="font-medium text-gray-900"
        >
          Booking Ref #:
        </label>

        <input
  id="bookingRefNo"
  type="text"
  value={bookingRefNo}
  onChange={(event) =>
    setBookingRefNo(event.target.value)
  }
  placeholder="Enter booking reference (optional)"
  className="input-class"
/>
      </div>
    </div>
  </div>
)}
          {/* Terms and Conditions Checkbox */}
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="terms"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-1"
            />

            <label htmlFor="terms" className="text-base text-gray-700">
              I accept the{" "}
              <Link
                href="/terms"
                className="text-primary hover:underline font-medium"
              >
                Terms & Conditions
              </Link>
              {" and "}
              <Link
                href="/return-refund"
                className="text-primary hover:underline font-medium"
              >
                Return & Refund Policy
              </Link>
              .
            </label>
          </div>
          {booking.bookingType === "website" ? (
         <>
    {cardBaseAmount > 0 && <StripeCardInput />}

    <PrimaryBtn
      onClick={handleConfirmPayment}
      disabled={loading}
      className="w-full justify-center py-3 text-lg"
    >
      {loading
        ? "Processing..."
        : cardBaseAmount > 0
          ? `Pay $${totalAmount.toFixed(2)}`
          : "Confirm Booking with Credit"}
    </PrimaryBtn>
  </>
          ) : (
            <PrimaryBtn
              onClick={handleConfirmPayment}
              disabled={loading}
              className="w-full justify-center py-3 text-lg"
            >
              {loading ? "Processing..." : "Confirm Booked"}
            </PrimaryBtn>
          )}
        </div>
      </Container>
    </section>
  );
}
