import {bookingsCollection, instructorsCollection} from "@/app/libs/mongodb/db";
import {ObjectId} from "mongodb";
import {NextResponse} from "next/server";

export async function GET(req, {params}) {
  try {
    const {bookingId} = await params;

    if (!ObjectId.isValid(bookingId)) {
      return NextResponse.json({error: "Invalid booking id"}, {status: 400});
    }

    const bookingsCol = await bookingsCollection();
    const instructorsCol = await instructorsCollection();

    const booking = await bookingsCol.findOne({
      _id: new ObjectId(bookingId),
    });

    if (!booking) {
      return NextResponse.json({error: "Not found"}, {status: 404});
    }

    // ✅ Fetch instructor using instructorId from booking
    let instructorPhoto = "";
    let instructorPhotoKey = "";
    let instructorName = booking.instructorName || "";

    if (booking.instructorId && ObjectId.isValid(booking.instructorId)) {
      const instructor = await instructorsCol.findOne({
        _id: new ObjectId(booking.instructorId),
      });

      if (instructor) {
        instructorPhoto = instructor.photo || "";
        instructorPhotoKey = instructor.photoKey || "";
        instructorName = instructor.name || instructorName;
      }
    }

    // ✅ Attach extra fields
    const enrichedBooking = {
      ...booking,
      instructorPhoto,
      instructorPhotoKey,
      instructorName,
    };

    return NextResponse.json(enrichedBooking);
  } catch (e) {
    console.error(e);
    return NextResponse.json({error: "Failed"}, {status: 500});
  }
}

export async function PATCH(req, {params}) {
  try {
    const {bookingId} = await params;
    console.log(bookingId);
    if (!ObjectId.isValid(bookingId)) {
      return NextResponse.json({error: "Invalid booking id"}, {status: 400});
    }

    const body = await req.json();

    // Allow only the fields you want to update
    const allowed = [
      "status",
      "paymentStatus", // "paid" | "partial" | "unpaid"
      "paymentMethod", // "card" | "cash" | "bank" | "mixed"
      "paymentIntentId",
      "paidAmount",
      "cashAmount",
      "cardAmount",
      "outstanding",
      "processingFee",
      "cardBrand",
      "cardLast4",
      "userPhone",
      "address",
      "suburb",
       "bookingDate",
  "bookingTime",
    ];

    const $set = {updatedAt: new Date()};
    for (const k of allowed) {
      if (body[k] !== undefined) $set[k] = body[k];
    }

    if ($set.bookingDate !== undefined) {
  const d = new Date($set.bookingDate);
  if (Number.isNaN(d.getTime())) {
    return NextResponse.json({ error: "Invalid bookingDate" }, { status: 400 });
  }
  $set.bookingDate = d; // store as Date in Mongo
}

if ($set.bookingTime !== undefined) {
  $set.bookingTime = String($set.bookingTime).trim();
}
    // tiny validation
    if ($set.paymentStatus) {
      const ok = ["paid", "partial", "unpaid"].includes(
        String($set.paymentStatus).toLowerCase(),
      );
      if (!ok)
        return NextResponse.json(
          {error: "Invalid paymentStatus"},
          {status: 400},
        );
      $set.paymentStatus = String($set.paymentStatus).toLowerCase();
    }
 
    if ($set.paymentMethod) {
      $set.paymentMethod = String($set.paymentMethod).toLowerCase();
    }
if ($set.status !== undefined) {
  const v = String($set.status).toLowerCase();
  const ok = ["pending", "confirmed", "cancelled", "completed", "unattended"].includes(v);
  if (!ok) return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  $set.status = v;
}

    const bookingsCol = await bookingsCollection();

    const update = await bookingsCol.updateOne(
  { _id: new ObjectId(bookingId) },
  { $set }
);

if (update.matchedCount === 0) {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}

const updatedDoc = await bookingsCol.findOne({ _id: new ObjectId(bookingId) });
return NextResponse.json(updatedDoc);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {error: "Failed to update booking"},
      {status: 500},
    );
  }
}
