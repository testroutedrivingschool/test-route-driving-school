"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import StripeCardInput from "@/app/shared/ui/StripeCardInput";
import {
  CardNumberElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useUserData } from "@/app/hooks/useUserData";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import axios from "axios";
import { toast } from "react-toastify";
import Container from "@/app/shared/ui/Container";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "@/app/hooks/useAuth";
import { FaXmark } from "react-icons/fa6";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
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
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null); // Store applied coupon

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

  const { data: locations = [], isLoading: isLocationsLoading } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const res = await axios.get("/api/locations");
      return res.data || [];
    },
  });

  const { data: instructors = [], isLoading: isInstructorsLoading } = useQuery({
    queryKey: ["instructors"],
    queryFn: async () => {
      const res = await axios.get("/api/instructors?status=approved");
      return res.data || [];
    },
  });

  const { data: coupons = [], isLoading: isCouponsLoading } = useQuery({
    queryKey: ["coupons"],
    queryFn: async () => {
      const res = await axios.get("/api/coupons");
      return res.data;
    },
  });

  // Handle applying coupon
  const handleApplyCoupon = () => {
    if (appliedCoupon) {
      toast.error("You can only apply one coupon.");
      return;
    }

    const coupon = coupons.find((coupon) => coupon.code === couponCode);

    if (!coupon) {
      toast.error("Invalid coupon code.");
      return;
    }

    const currentDate = new Date();
    const expiryDate = new Date(coupon.expires);

    if (expiryDate < currentDate) {
      toast.error("Coupon has expired.");
      return;
    }

    const discountAmount = (total * coupon.discount) / 100;
    setDiscount(discountAmount);
    setTotal(total - discountAmount);
    setAppliedCoupon(coupon.code); // Save applied coupon

    toast.success(`Coupon applied! You get ${coupon.discount}% off.`);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null); // Remove coupon
    setDiscount(0); // Reset discount
    const originalTotal = JSON.parse(sessionStorage.getItem("checkoutCart")) || [];
    const calculatedTotal = originalTotal.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotal(calculatedTotal); // Reset total to original
    setCouponCode(""); // Clear coupon code input
  };

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
      0
    );
    setTotal(calculatedTotal);
  }, []);

  const handleBillingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBilling((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

console.log(appliedCoupon);
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

    // 3) Send the discount and total (after discount) to the backend
    const finalAmount = total - discount; // Final amount after applying the discount
    const { data } = await axios.post("/api/create-payment-intent", {
      type: "purchase",
      instructorId: selectedInstructorId,
      userEmail: billing.email,
      userName: billing.name,
      couponCode:appliedCoupon,
      items,
      discount: discount, 
      totalAmount: finalAmount,
    });

    const clientSecret = data?.clientSecret;
    if (!clientSecret) throw new Error("No clientSecret returned");

    setTotal(finalAmount); // Update total after discount

    // Optional: use backend amount for UI consistency
    const serverAmount = Number(data?.amount || 0);
const serverDiscountAmount =Number(data?.discountAmount || 0)
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
      discountAmount:serverDiscountAmount,
      amount: serverAmount,  // Use the discounted amount here
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
  if (authLoading) return <LoadingSpinner />;
  if (profileLoading) return <LoadingSpinner />;
  if (isLocationsLoading || isInstructorsLoading) return <LoadingSpinner />;

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
   <PhoneInput
              country={"au"}
              value={billing.mobile}
              onChange={(value) => setBilling({ ...billing, mobile: value })}
              inputStyle={{
                width: "100%",
                height: "48px",
                borderRadius: "12px",
                border: "1px solid #e7e7e9e6",
              }}
            />
        
           


          <input
            type="text"
            name="address"
            placeholder="Address"
            value={billing.address}
            onChange={handleBillingChange}
            className="input-class"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <option defaultValue={true} value="NSW">
                New South Wales
              </option>
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
<div> <label className="font-bold text-lg mb-4 block">Select Instructor:</label> <select name="instructorId" value={billing.instructorId} onChange={handleBillingChange} className="input-class" > <option value="">Choose Instructor</option> {instructors.map((inst) => ( <option key={inst._id} value={inst._id}> {inst.name} </option> ))} </select> </div>
          {/* Coupon Input Section */}
          <div className="my-4">
            <p
              className="cursor-pointer text-primary font-bold"
              onClick={() => setShowCouponInput((prev) => !prev)}
            >
              {showCouponInput ? "Hide coupon code" : "Have a coupon code?"}
            </p>

            {showCouponInput && !appliedCoupon && (
              <div className="mt-2 space-y-4">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className={`input-class`}
                />
                <PrimaryBtn className={`text-sm! px-2!`} onClick={handleApplyCoupon}>
                  Apply Coupon
                </PrimaryBtn>
              </div>
            )}
          </div>

          {/* Display applied coupon */}
          {appliedCoupon && (
            <div className="my-4 text-green-600">
              <p className="font-bold flex items-center">
                Coupon applied: <span className="bg-green-100 p-1 px-2 text-sm flex items-center gap-1 rounded-full">{appliedCoupon} <FaXmark className="cursor-pointer "
                  onClick={handleRemoveCoupon}/></span><span className="px-1"> -${discount.toFixed(2)}</span>
              
                 
               
              </p>
            </div>
          )}

          <p className="font-bold my-5 text-lg">
            Total Amount: <span className="text-primary">${total.toFixed(2)}</span>
          </p>
        </div>

        <div className="mt-4 space-y-2">
          <StripeCardInput />
        </div>

        <PrimaryBtn
          onClick={handleProceed}
          className="mt-6 text-base! md:text-lg! py-2! md:py-3! px-2! md:px-4!"
        >
          {loading ? "Processing..." : `Pay $${total.toFixed(2)}`}
        </PrimaryBtn>
      </Container>
    </section>
  );
}