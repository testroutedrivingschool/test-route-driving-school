import Stripe from "stripe";
import { ObjectId } from "mongodb";
import { bookingsCollection } from "@/app/libs/mongodb/db";

const stripe = new Stripe(process.env.NEXT_PUBLIC_Stripe_Secret_key);

export async function POST(req) {
  try {
    const { bookingId, amount } = await req.json();

    if (!bookingId) {
      return new Response(JSON.stringify({ error: "Booking ID required" }), { status: 400 });
    }

    const cardAmount = Number(amount || 0);
    if (cardAmount <= 0) {
      return new Response(JSON.stringify({ error: "Amount must be > 0" }), { status: 400 });
    }

    const col = await bookingsCollection();
    const booking = await col.findOne({ _id: new ObjectId(bookingId) });

    if (!booking) {
      return new Response(JSON.stringify({ error: "Booking not found" }), { status: 404 });
    }

    const outstanding = Number(booking.outstanding ?? Math.max(0, Number(booking.price || 0) - Number(booking.paidAmount || 0)));

    if (cardAmount > outstanding) {
      return new Response(JSON.stringify({ error: "Amount exceeds outstanding" }), { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(cardAmount * 100), // cents
      currency: "aud",
      payment_method_types: ["card"],
      metadata: {
        bookingId,
        clientName: booking.clientName,
        serviceName: booking.serviceName,
      },
    });

    return new Response(JSON.stringify({ clientSecret: paymentIntent.client_secret }), { status: 200 });
  } catch (err) {
    console.error("Stripe PaymentIntent Error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
