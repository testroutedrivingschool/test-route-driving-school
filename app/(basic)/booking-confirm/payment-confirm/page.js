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
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
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
    axios.get("/api/locations").then((res) => {
      setLocations(res.data);
    });
  }, []);

  if (!booking) return <LoadingSpinner />;
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
          await axios.patch(`/api/clients/${clientId}`, {address, suburb});
        }

        await axios.post("/api/bookings", {
          ...booking,
          address,
          suburb,
          status: "pending",
          paymentStatus: "unpaid",
          paymentIntentId: null,
        });

        sessionStorage.removeItem("pendingBooking");
        toast.success("Booking created (Unpaid) ✅");
        router.push("/instructor-bookings");
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
          amount: booking.price,
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

        await axios.post("/api/bookings", {
          ...booking,
          address,
          suburb,
          paymentIntentId: result.paymentIntent.id,
          status: "pending",
          paymentStatus: "paid",
        });
        await axios.patch(`/api/users`, {
          email: booking.userEmail,
          address,
          suburb,
          phone,
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
        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-md p-6 space-y-6">
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
            <p className="text-lg font-bold ">Total: <span className="text-primary">${booking.price.toFixed(2)}</span> </p>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="font-medium">Phone</label>
            <PhoneInput
                    country={"au"}
                    required
                 value={phone}
                      onChange={(value) => setPhone(value)}
                    inputStyle={{
                      width: "100%",
                      height: "48px",
                      borderRadius: "12px",
                      border:"1px solid #e7e7e9e6",
                    }}
                    
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
              placeholder="123 Main Street"
            />
          </div>

          {/* Suburb */}
          <div className="space-y-2">
            <label className="font-medium">Suburb</label>
            <select
              value={suburb}
              onChange={(e) => setSuburb(e.target.value)}
              className="input-class"
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
                {loading ? "Processing..." : `Pay $${booking.price}`}
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
