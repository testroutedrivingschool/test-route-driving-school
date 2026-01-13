"use client";

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import StripeCardInput from "@/app/shared/ui/StripeCardInput";
import {
  CardNumberElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";
import {useUserData} from "@/app/hooks/useUserData";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import axios from "axios";
import {toast} from "react-toastify";
import Container from "@/app/shared/ui/Container";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_Stripe_Publishable_key);

export default function CheckoutWrapper() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutPage />
    </Elements>
  );
}

function CheckoutPage() {
  const [total, setTotal] = useState(0);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {data: user, isLoading} = useUserData();
  useEffect(() => {
    if (!isLoading && !user) {
      const redirectUrl = "/checkout";
      router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
    }
  }, [user, isLoading, router]);
  const elements = useElements();
  const stripe = useStripe();
  const [billing, setBilling] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    suburb: "",
    state: "",
    postCode: "",
  });

  useEffect(() => {
    if (user) {
      setBilling({
        name: user.name || "",
        email: user.email || "",
        mobile: user.phone || "",
        address: user.address || "",
        suburb: user.suburb || "",
        state: user.state || "",
        postCode: user.postCode || "",
      });
    }
  }, [user]);

  useEffect(() => {
    const storedCart = JSON.parse(sessionStorage.getItem("checkoutCart")) || [];

    // calculate total from storedCart
    const calculatedTotal = storedCart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotal(calculatedTotal);
  }, []);

  const handleBillingChange = (e) => {
    const {name, value, type, checked} = e.target;
    setBilling((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleProceed = async () => {
    if (!billing.state) {
      return toast.error("Select your State");
    }
    if (!stripe || !elements) return;
    setLoading(true);

    try {
      const {data} = await axios.post("/api/create-payment-intent", {
        amount: total,
      });

      const cardElement = elements.getElement(CardNumberElement);
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: billing.name,
            email: billing.email,
            address: {line1: billing.address},
          },
        },
      });

      if (result.error) {
        toast.error(result.error.message);
        setLoading(false);
        return;
      }

      // Payment succeeded
      toast.success("Payment Successful 🎉");
      localStorage.removeItem("cart");
      sessionStorage.removeItem("checkoutCart");
      router.push("/dashboard/my-bookings");
    } catch (err) {
      console.error(err);
      toast.error("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || !user) return <LoadingSpinner />;
  return (
    <section className="py-16">
      <Container className={`max-w-4xl!`}>
        <h1 className="text-3xl font-bold mb-6">Billing Details</h1>

        <div className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Enter your Name"
            value={billing.name}
            onChange={handleBillingChange}
            className="input-class"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={billing.email}
            onChange={handleBillingChange}
            className="input-class"
          />

          <input
            type="text"
            name="mobile"
            placeholder="Mobile"
            value={billing.mobile}
            onChange={handleBillingChange}
            className="input-class"
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={billing.address}
            onChange={handleBillingChange}
            className="input-class"
          />

          <div className="grid grid-cols-3 gap-4">
            <input
              type="text"
              name="suburb"
              placeholder="Suburb"
              value={billing.suburb}
              onChange={handleBillingChange}
              className="input-class"
            />

            <select
              name="state"
              value={billing.state}
              onChange={handleBillingChange}
              required
              className="input-class"
            >
              <option value="">Choose State</option>
              <option value="NSW">New South Wales</option>
              <option value="VIC">Victoria</option>
              <option value="QLD">Queensland</option>
              <option value="WA">Western Australia</option>
              <option value="SA">South Australia</option>
              <option value="TAS">Tasmania</option>
              <option value="ACT">Australian Capital Territory</option>
              <option value="NT">Northern Territory</option>
            </select>

            <input
              type="text"
              name="postCode"
              placeholder="Post Code"
              value={billing.postCode}
              onChange={handleBillingChange}
              className="input-class"
            />
          </div>

          <p className="font-semibold my-5">
            Total Amount: ${total.toFixed(2)}
          </p>
        </div>

        <div className=" space-y-2">
          <StripeCardInput />
        </div>

        <PrimaryBtn onClick={handleProceed} className="mt-6  py-3 text-lg">
          {loading ? "Processing..." : `Proceed`}
        </PrimaryBtn>
      </Container>{" "}
    </section>
  );
}
