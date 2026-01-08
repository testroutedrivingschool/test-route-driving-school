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

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_TEST_Publishable_key);

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
  const [suburb, setSuburb] = useState(booking?.location || "");
  const [loading, setLoading] = useState(false);

  /* Load booking */
  useEffect(() => {
    const data = sessionStorage.getItem("pendingBooking");
    if (!data) {
      router.push("/bookings");
      return;
    }
    const bookingData = JSON.parse(data);
    console.log(bookingData);
    setBooking(bookingData);
    setAddress(bookingData.userAddress || "");
    setSuburb(bookingData.location || "");
  }, [router]);

  /* Load suburbs */
  useEffect(() => {
    axios.get("/api/locations").then((res) => {
      setLocations(res.data);
    });
  }, []);

  if (!booking) return <LoadingSpinner />;

  const handleConfirmPayment = async () => {
    if (!stripe || !elements) return;

    if (!address || !suburb) {
      return toast.error("Please complete address details");
    }

    setLoading(true);

    try {
      const {data} = await axios.post("/api/create-payment-intent", {
        amount: booking.price,
      });
      const cardElement = elements.getElement(CardNumberElement);
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            address: {line1: address},
          },
        },
      });

      if (result.error) {
        toast.error(result.error.message);
        setLoading(false);
        return;
      }

      await axios.post("/api/bookings", {
        ...booking,
        address,
        suburb,
        paymentIntentId: result.paymentIntent.id,
        status: "paid",
      });

      sessionStorage.removeItem("pendingBooking");

      toast.success("Booking confirmed 🎉");
      router.push("/dashboard/my-bookings");
    } catch (err) {
      console.error(err);
      toast.error("Failed to Booking");
    } finally {
      setLoading(false);
    }
  };

  console.log(booking);
  return (
    <section className="py-20 bg-gray-50">
      <Container>
        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-md p-8 space-y-6">
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
            <p className="text-lg font-semibold">Total: ${booking.price}</p>
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

          {/* Card */}
          <div className="space-y-2">
            <StripeCardInput />
          </div>

          <PrimaryBtn
            onClick={handleConfirmPayment}
            disabled={loading}
            className="w-full justify-center py-3 text-lg"
          >
            {loading ? "Processing..." : `Pay $${booking.price}`}
          </PrimaryBtn>
        </div>
      </Container>
    </section>
  );
}
