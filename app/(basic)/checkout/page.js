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
import {useMemo} from "react";
import {useQuery} from "@tanstack/react-query";
import useAuth from "@/app/hooks/useAuth";
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_Stripe_Publishable_key,
);

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
   const { user: authUser, loading: authLoading } = useAuth(); 
  const { data: user, isLoading: profileLoading } = useUserData();

  useEffect(() => {
    if (authLoading) return; 
    if (!authUser) {
      router.replace(`/login?redirect=${encodeURIComponent("/checkout")}`);
    }
  }, [authLoading, authUser, router]);

  const {data: locations = [], isLoading: isLocationsLoading} = useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const res = await axios.get("/api/locations");
      return res.data || [];
    },
  });
  const {data: instructors = [], isLoading: isInstructorsLoading} = useQuery({
    queryKey: ["instructors"],
    queryFn: async () => {
      const res = await axios.get("/api/instructors?status=approved");
      return res.data || [];
    },
  });

  const suburbOptions = useMemo(() => {
    const names = locations.map((l) => (l?.name || "").trim()).filter(Boolean);

    return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b));
  }, [locations]);
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
    instructorId: "",
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
      0,
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
  if (!billing.state) return toast.error("Select your State");

  const selectedInstructorId = billing.instructorId || instructors?.[0]?._id;
  if (!selectedInstructorId) return toast.error("No instructor available");

  if (!stripe || !elements) return;

  setLoading(true);

  try {
    // 1) Read cart
    const storedCart = JSON.parse(sessionStorage.getItem("checkoutCart")) || [];
    if (!Array.isArray(storedCart) || storedCart.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    // 2) Send ONLY packageId + quantity to backend
    const items = storedCart.map((x) => ({
      packageId: x.packageId || x._id,
      quantity: Number(x.quantity || 1),
    }));

    // 3) Create payment intent (backend computes amount from DB)
    const { data } = await axios.post("/api/create-payment-intent", {
      type: "purchase",
      instructorId: selectedInstructorId,
      userEmail: billing.email,
      userName: billing.name,
      items,
    });

    const clientSecret = data?.clientSecret;
    if (!clientSecret) throw new Error("No clientSecret returned");
setTotal(Number(data.amount || 0));
    // Optional: use backend amount for UI consistency
    const serverAmount = Number(data?.amount || 0);

    // 4) Confirm payment
    const cardElement = elements.getElement(CardNumberElement);
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: billing.name,
          email: billing.email,
          address: { line1: billing.address },
        },
      },
    });

    if (result.error) {
      toast.error(result.error.message);
      return;
    }

    const paymentIntentId = result?.paymentIntent?.id;
    if (!paymentIntentId) throw new Error("Missing paymentIntentId");

    // 5) Save purchase (send minimal + trustworthy data)
    await axios.post("/api/purchases", {
      userId: user?._id || "",
      userEmail: user?.email || billing.email,
      instructorId: selectedInstructorId,
      items,                 
      amount: serverAmount,  
      currency: "aud",
      paymentIntentId,
      billing: {
        name: billing.name,
        email: billing.email,
        mobile: billing.mobile,
        address: billing.address,
        suburb: billing.suburb,
        state: billing.state,
        postCode: billing.postCode,
      },
    });

    toast.success("Payment Successful 🎉");
    localStorage.removeItem("cart");
    sessionStorage.removeItem("checkoutCart");
    router.push("/dashboard/user/purchases");
  } catch (err) {
   
    toast.error(err?.response?.data?.error || err.message || "Payment failed");
  } finally {
    setLoading(false);
  }
};


// ✅ show spinner until auth is known
  if (authLoading) return <LoadingSpinner />;

  // ✅ if logged in, wait profile fetch
  if (profileLoading) return <LoadingSpinner />;
  if ( isLocationsLoading || isInstructorsLoading)
    return <LoadingSpinner />;
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
            <select
              name="suburb"
              value={billing.suburb}
              onChange={handleBillingChange}
              required
              className="input-class"
            >
              <option value="">Choose Suburb</option>
              {suburbOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

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
        <div>
          <label className="font-bold text-lg mb-4 block">Select Instructor:</label>
          <select
  name="instructorId"
  value={billing.instructorId}
  onChange={handleBillingChange}
  className="input-class"
>
  <option value="">Choose Instructor</option>
  {instructors.map((inst) => (
    <option key={inst._id} value={inst._id}>
      {inst.name}
    </option>
  ))}
</select>
        </div>
        <div className="mt-4  space-y-2">
          <StripeCardInput />
        </div>

        <PrimaryBtn onClick={handleProceed} className="mt-6  py-3 text-lg">
          {loading ? "Processing..." : `Proceed`}
        </PrimaryBtn>
      </Container>{" "}
    </section>
  );
}
