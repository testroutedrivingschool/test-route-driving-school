/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {useEffect, useState} from "react";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {FaTimes} from "react-icons/fa";
import Container from "@/app/shared/ui/Container";
import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  // 🔄 Sync to localStorage
  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // ➕➖ Quantity update
  const updateQuantity = (id, qty) => {
    const updated = cart.map((item) =>
      item._id === id ? {...item, quantity: Number(qty)} : item
    );
    updateCart(updated);
  };

  // ❌ Remove item
  const removeItem = (id) => {
    const updated = cart.filter((item) => item._id !== id);
    updateCart(updated);
  };

 
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // 💳 Checkout
  const handleCheckout = async () => {



    sessionStorage.setItem("checkoutCart", JSON.stringify(cart));
    router.push("/checkout");
  };

  if (!cart.length) {
    return (
      <Container>
        <h2 className="text-2xl font-bold my-10">Your cart is empty</h2>
        <PrimaryBtn onClick={() => router.push("/packages")}>
          Search Packages
        </PrimaryBtn>
      </Container>
    );
  }

  return (
  <section className="py-16">
  <Container>
    <h1 className="text-3xl font-bold mb-10">Shopping Cart</h1>

    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        {/* Table Head */}
        <thead>
          <tr className="bg-secondary text-white text-left">
            <th className="py-3 px-4">Product</th>
            <th className="py-3 px-4 text-center">Quantity</th>
            <th className="py-3 px-4 text-right hidden md:table-cell">
              Unit Price
            </th>
            <th className="py-3 px-4 text-right">Total</th>
            <th className="py-3 px-4 text-center"></th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {cart.map((item) => {
            const itemTotal = item.price * item.quantity;

            return (
              <tr
                key={item._id}
                className="border-b border-border-color"
              >
                {/* Product */}
                <td className="py-4 px-4 flex items-center gap-4">
                  <Image
                    src={item.image}
                    alt={item.name || "Package"}
                    width={80}
                    height={60}
                    className="rounded hidden md:block"
                  />
                  <span className="font-medium text-sm md:text-base">
                    {item.name}
                  </span>
                </td>

                {/* Quantity */}
                <td className="py-4 px-4 text-center">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item._id, e.target.value)
                    }
                    className="w-16 border border-border-color rounded px-2 py-1 text-center"
                  />
                </td>

                {/* Unit Price */}
                <td className="py-4 px-4 text-right hidden md:table-cell">
                  ${Number(item.price || 0).toFixed(2)}
                </td>

                {/* Total */}
                <td className="py-4 px-4 text-right font-semibold">
                  ${itemTotal.toFixed(2)}
                </td>

                {/* Remove */}
                <td className="py-4 px-4 text-center">
                  <button onClick={() => removeItem(item._id)}>
                    <FaTimes className="text-gray-400 hover:text-red-600 transition" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>

    {/* Summary */}
    <div className="flex justify-end mt-10">
      <h3 className="text-lg md:text-2xl font-bold">
        Total: ${total.toFixed(2)}
      </h3>
    </div>

    {/* Actions */}
    <div className="flex justify-between items-center mt-12">
      <button
        onClick={() => router.push("/packages")}
        className="border border-primary text-primary px-3 md:px-6 py-2 md:py-3 rounded hover:bg-primary hover:text-white transition"
      >
        Keep Shopping
      </button>

      <PrimaryBtn onClick={handleCheckout} className="md:px-10 md:py-4 text-lg">
        Check Out
      </PrimaryBtn>
    </div>
  </Container>
</section>
  );
}
