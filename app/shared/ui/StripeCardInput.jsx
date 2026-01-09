"use client";

import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import Image from "next/image";
import {FaLock} from "react-icons/fa";
import cvcIcon from "@/app/assets/ccv.png";

export default function StripeCardInput() {
  const CARD_STYLE = {
    style: {
      base: {
        fontSize: "16px",
        color: "#1f2937",
        fontFamily: "sans-serif",
        "::placeholder": {color: "#9ca3af"},
       
      },
      invalid: {color: "#ef4444"},
    },
  };

  return (
    <div className="bg-white border border-gray-300 rounded-xl p-6 space-y-4 shadow-sm">
      <h3 className="font-medium text-gray-800 flex items-center gap-2">
        <FaLock className="text-gray-500" /> Card Details
      </h3>

      {/* Card Number */}
      <div className="flex flex-col">
        <label className="text-gray-600 text-sm mb-1">Card Number</label>
        <div className="input-class">
          <CardNumberElement options={CARD_STYLE} />
        </div>
      </div>

      {/* Expiry and CVC */}
      <div className="flex gap-4">
        <div className="flex-1 flex flex-col">
          <label className="text-gray-600 text-sm mb-1">Expiry</label>
          <div className="input-class">
            <CardExpiryElement options={CARD_STYLE} />
          </div>
        </div>
        <div className="flex-1 flex flex-col">
  <label className="text-gray-600 text-sm mb-1">Security Code</label>
  <div className="border border-gray-300 rounded-xl p-2 bg-gray-50 flex items-center gap-2">
    <div className="flex-1">
      <CardCvcElement options={CARD_STYLE} />
    </div>
    <Image
      src={cvcIcon}
      alt="CVC icon"
      width={24}
      height={24}
      className="w-6 h-6"
    />
  </div>
</div>
      </div>
    </div>
  );
}
