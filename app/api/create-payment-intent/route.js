import Stripe from "stripe";
import { ObjectId } from "mongodb";
import {
  bookingsCollection,
  packagesCollection,
  couponsCollection,
} from "@/app/libs/mongodb/db";

const stripe = new Stripe(process.env.NEXT_PUBLIC_Stripe_Secret_key);

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      type = "booking-new",
      currency = "aud",
      bookingId,
      amount,
      userEmail,
      userName,
      instructorId,
      items = [],
      metadata = {},
      couponCode,
      discount = 0,
      totalAmount,
    } = body || {};

    let discountAmount = 0;

    // --------------------------
    // 1) EXISTING BOOKING PAYMENT
    // --------------------------
    if (type === "booking-existing") {
      const cardAmount = Number(amount || 0);
      if (cardAmount <= 0) {
        return new Response(
          JSON.stringify({ error: "Amount must be > 0" }),
          { status: 400 }
        );
      }
      if (!bookingId) {
        return new Response(
          JSON.stringify({ error: "bookingId required for booking-existing" }),
          { status: 400 }
        );
      }

      const col = await bookingsCollection();
      const booking = await col.findOne({ _id: new ObjectId(bookingId) });
      if (!booking)
        return new Response(JSON.stringify({ error: "Booking not found" }), {
          status: 404,
        });

      const outstanding = Number(
        booking.outstanding ??
          Math.max(0, Number(booking.price || 0) - Number(booking.paidAmount || 0))
      );

      if (cardAmount > outstanding) {
        return new Response(
          JSON.stringify({ error: "Amount exceeds outstanding" }),
          { status: 400 }
        );
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(cardAmount * 100),
        currency,
        payment_method_types: ["card"],
        metadata: {
          type: "booking-existing",
          bookingId: String(bookingId),
          userEmail: booking.userEmail || booking.clientEmail || "",
          userName: booking.userName || booking.clientName || "",
          instructorId: booking.instructorId || "",
          serviceName: booking.serviceName || "",
          ...metadata,
        },
      });

      return new Response(
        JSON.stringify({ clientSecret: paymentIntent.client_secret }),
        { status: 200 }
      );
    }

    // --------------------------
    // 2) NEW BOOKING PAYMENT
    // --------------------------
    if (type === "booking-new") {
      let cardAmount = Number(amount || 0);
      if (cardAmount <= 0) {
        return new Response(
          JSON.stringify({ error: "Amount must be > 0" }),
          { status: 400 }
        );
      }

      if (couponCode) {
        const couponCol = await couponsCollection();
        const coupon = await couponCol.findOne({ code: couponCode });
        if (coupon) {
          const currentDate = new Date();
          const expiryDate = new Date(coupon.expires);

          if (expiryDate >= currentDate) {
            discountAmount = (cardAmount * coupon.discount) / 100;
            cardAmount -= discountAmount; // Apply the discount to the total amount
          } else {
            return new Response(
              JSON.stringify({ error: "Coupon has expired" }),
              { status: 400 }
            );
          }
        } else {
          return new Response(
            JSON.stringify({ error: "Invalid coupon code" }),
            { status: 400 }
          );
        }
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(cardAmount * 100),
        currency,
        payment_method_types: ["card"],
        metadata: {
          type: "booking-new",
          userEmail,
          userName: userName || "",
          instructorId,
          discountAmount, // Add discount amount to metadata
          ...metadata,
        },
      });

  
     
      

      return new Response(
        JSON.stringify({
          clientSecret: paymentIntent.client_secret,
          discountAmount,
        }),
        { status: 200 }
      );
    }

    // --------------------------
    // 3) PACKAGE PURCHASE PAYMENT
    // --------------------------
    if (type === "purchase") {
      if (!userEmail) {
        return new Response(
          JSON.stringify({ error: "userEmail required" }),
          { status: 400 }
        );
      }
      if (!instructorId) {
        return new Response(
          JSON.stringify({ error: "instructorId required" }),
          { status: 400 }
        );
      }
      if (!Array.isArray(items) || items.length === 0) {
        return new Response(
          JSON.stringify({ error: "items required" }),
          { status: 400 }
        );
      }

      const normalizedItems = items
        .map((i) => ({
          packageId: String(i.packageId || i._id || "").trim(),
          quantity: Math.max(1, Number(i.quantity || 1)),
        }))
        .filter((i) => i.packageId);

      if (normalizedItems.length === 0) {
        return new Response(
          JSON.stringify({ error: "Valid packageId required in items" }),
          { status: 400 }
        );
      }

      // Fetch packages from DB
      const pkgCol = await packagesCollection();
      const pkgIds = normalizedItems.map((i) => new ObjectId(i.packageId));

      const pkgs = await pkgCol
        .find({ _id: { $in: pkgIds } })
        .project({ title: 1, name: 1, price: 1 })
        .toArray();

      const pkgMap = new Map(pkgs.map((p) => [String(p._id), p]));

      const missing = normalizedItems.filter((i) => !pkgMap.has(i.packageId));
      if (missing.length) {
        return new Response(
          JSON.stringify({
            error: "Some packages not found",
            missing: missing.map((m) => m.packageId),
          }),
          { status: 400 }
        );
      }

      const lineItems = normalizedItems.map((i) => {
        const p = pkgMap.get(i.packageId);
        const unitPrice = Number(p?.price || 0);
        return {
          packageId: i.packageId,
          title: p?.title || p?.name || "",
          quantity: i.quantity,
          unitPrice,
          lineTotal: unitPrice * i.quantity,
        };
      });

      let totalAmount = lineItems.reduce((sum, li) => sum + li.lineTotal, 0);

      if (couponCode) {
        const couponCol = await couponsCollection();
        const coupon = await couponCol.findOne({ code: couponCode });
        if (coupon) {
          const currentDate = new Date();
          const expiryDate = new Date(coupon.expires);

          if (expiryDate >= currentDate) {
            discountAmount = (totalAmount * Number(coupon.discount)) / 100;
            totalAmount -= discountAmount;
          } else {
            return new Response(
              JSON.stringify({ error: "Coupon has expired" }),
              { status: 400 }
            );
          }
        } else {
          return new Response(
            JSON.stringify({ error: "Invalid coupon code" }),
            { status: 400 }
          );
        }
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(totalAmount * 100),
        currency,
        payment_method_types: ["card"],
        metadata: {
          type: "purchase",
          userEmail,
          userName,
          instructorId,
          discountAmount,
          ...metadata,
        },
      });

    

      return new Response(
        JSON.stringify({
          clientSecret: paymentIntent.client_secret,
          amount: totalAmount,
          discountAmount,
          currency,
          lineItems: items,
        }),
        { status: 200 }
      );
    }

    return new Response(JSON.stringify({ error: "Invalid type" }), { status: 400 });
  } catch (err) {
    console.error("Stripe PaymentIntent Error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}