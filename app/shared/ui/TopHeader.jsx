
"use client";
import React, {useEffect, useState} from "react";
import Container from "./Container";
import Link from "next/link";
import {useUserData} from "@/app/hooks/useUserData";
import LoadingSpinner from "./LoadingSpinner";

export default function TopHeader() {
  const {data: userData, isLoading} = useUserData();
  const [hasCartItem, setHasCartItem] = useState(false);

  useEffect(() => {
    const checkCart = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setHasCartItem(cart.length > 0); // ✅ updates correctly when empty
    };

    checkCart(); // initial check

    window.addEventListener("cartUpdated", checkCart); // reacts to add/remove
    window.addEventListener("storage", checkCart);     // reacts to other tabs

    return () => {
      window.removeEventListener("cartUpdated", checkCart);
      window.removeEventListener("storage", checkCart);
    };
  }, []);

 
  return (
    <div className="bg-primary text-white py-1 md:py-2 w-full">
      <Container className="flex items-center justify-between">
       <Link href="/packages" className="font-semibold text-xs md:text-base hover:underline">
              View Packages
            </Link>
        
        <div className="space-x-5">
          {hasCartItem && (
            <Link href="/cart" className="hover:underline font-semibold text-xs md:text-base">
              View Cart
            </Link>
          )}
          {userData && userData.role === "instructor" ? (
            <Link href={`/company/contact`} className="hover:underline font-semibold text-xs md:text-base">
              Help
            </Link>
          ) : (
            <Link href="/bookings" className="hover:underline font-semibold text-xs md:text-base">
              Book Now
            </Link>
          )}
        </div>
      </Container>
    </div>
  );
}
