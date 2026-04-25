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

export default function PaymentConfirmPage() {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  );
}

function calculateStripeTotal(baseAmount) {
  const STRIPE_PERCENT = 0.017;
  const STRIPE_FIXED = 0.20;
  const GST_RATE = 0.10;

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

  /* Load booking */
  useEffect(() => {
    const data = sessionStorage.getItem("pendingBooking");
    if (!data) {
      router.push("/bookings");
      return;
    }
    const bookingData = JSON.parse(data);

    setBooking(bookingData);
    setAddress(bookingData.clientAddress ?? bookingData.userAddress ?? "");
    setPhone(bookingData.clientPhone || bookingData.userPhone || "");
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

  if (!booking) return <LoadingSpinner />;

const baseAmount = Number(booking.price || 0);

const feeData =
  booking.bookingType === "website"
    ? calculateStripeTotal(baseAmount)
    : {
        totalAmount: baseAmount,
        processingFee: 0,
        stripeFee: 0,
        tax: 0,
        netAmount: baseAmount,
      };

const totalAmount = feeData.totalAmount;
const processingFee = feeData.processingFee;




  const handleConfirmPayment = async () => {
    if (!acceptedTerms) {
      toast.error("Please accept the terms and conditions");
      return;
    }
    if (!address || !suburb)
      return toast.error("Please complete address details");

    setLoading(true);

    try {
     const clientId = String(booking?.clientId);

      // ✅ MANUAL booking => NO payment
      if (booking.bookingType === "manual") {
        if (clientId) {
          await axios.patch(`/api/clients/${clientId}`, {address, suburb,mobile:phone});
        }

        await axios.post("/api/bookings", {
          ...booking,
          address,
          suburb,
         

  price: booking.price,
totalPaidAmount: booking.price,
processingFee: 0,
          status: "pending",
          paymentStatus: "unpaid",
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
        if (!stripe || !elements) return;

        const cardElement = elements.getElement(CardNumberElement);
        if (!cardElement) {
          toast.error("Card input not ready");
          return;
        }

        const {data} = await axios.post("/api/create-payment-intent", {
          amount: baseAmount,
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
const clientId = String(booking?.clientId);
        await axios.post("/api/bookings", {
          ...booking,
          phone,
          address,
          suburb,

         
          

totalPaidAmount: data.totalAmount,
processingFee: data.processingFee,
  
  price: baseAmount,          
             
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
    
      toast.error("Failed to Booking");
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
  Total: <span className="text-primary">${totalAmount.toFixed(2)}</span>
</p>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="font-medium">Phone</label>
            <input
              type="number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="input-class"
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
              <StripeCardInput />
              <PrimaryBtn
                onClick={handleConfirmPayment}
                disabled={loading}
                className="w-full justify-center py-3 text-lg"
              >
              {loading ? "Processing..." : `Pay $${totalAmount.toFixed(2)}`}
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
