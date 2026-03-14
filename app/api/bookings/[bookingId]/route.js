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

    if (!ObjectId.isValid(bookingId)) {
      return NextResponse.json({error: "Invalid booking id"}, {status: 400});
    }

    const body = await req.json();

    const allowed = [
      "status",
      "paymentStatus",
      "paymentMethod",
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

      // ✅ cost override fields
      "price",
      "originalPrice",
      "overridePrice",
      "isPriceOverridden",
    ];

    const $set = {updatedAt: new Date()};

    for (const k of allowed) {
      if (body[k] !== undefined) $set[k] = body[k];
    }

    if ($set.bookingDate !== undefined) {
      const d = new Date($set.bookingDate);
      if (Number.isNaN(d.getTime())) {
        return NextResponse.json({error: "Invalid bookingDate"}, {status: 400});
      }
      $set.bookingDate = d;
    }

    if ($set.bookingTime !== undefined) {
      $set.bookingTime = String($set.bookingTime).trim();
    }

    if ($set.paymentStatus !== undefined) {
      const v = String($set.paymentStatus).toLowerCase();
      const ok = ["paid", "partial", "unpaid"].includes(v);
      if (!ok) {
        return NextResponse.json({error: "Invalid paymentStatus"}, {status: 400});
      }
      $set.paymentStatus = v;
    }

    if ($set.paymentMethod !== undefined) {
      $set.paymentMethod = String($set.paymentMethod).toLowerCase();
    }

    if ($set.status !== undefined) {
      const v = String($set.status).toLowerCase();
      const ok = ["pending", "confirmed", "cancelled", "completed", "unattended"].includes(v);
      if (!ok) {
        return NextResponse.json({error: "Invalid status"}, {status: 400});
      }
      $set.status = v;
    }

    // ✅ normalize numbers
    if ($set.price !== undefined) {
      $set.price = Number($set.price);
      if (Number.isNaN($set.price) || $set.price < 0) {
        return NextResponse.json({error: "Invalid price"}, {status: 400});
      }
    }

    if ($set.originalPrice !== undefined) {
      $set.originalPrice = Number($set.originalPrice);
      if (Number.isNaN($set.originalPrice) || $set.originalPrice < 0) {
        return NextResponse.json({error: "Invalid originalPrice"}, {status: 400});
      }
    }

    if ($set.overridePrice !== undefined) {
      if ($set.overridePrice === null || $set.overridePrice === "") {
        $set.overridePrice = null;
      } else {
        $set.overridePrice = Number($set.overridePrice);
        if (Number.isNaN($set.overridePrice) || $set.overridePrice < 0) {
          return NextResponse.json({error: "Invalid overridePrice"}, {status: 400});
        }
      }
    }

    if ($set.isPriceOverridden !== undefined) {
      $set.isPriceOverridden = !!$set.isPriceOverridden;
    }

    const bookingsCol = await bookingsCollection();

    const update = await bookingsCol.updateOne(
      {_id: new ObjectId(bookingId)},
      {$set},
    );

    if (update.matchedCount === 0) {
      return NextResponse.json({error: "Not found"}, {status: 404});
    }

    const updatedDoc = await bookingsCol.findOne({_id: new ObjectId(bookingId)});
    return NextResponse.json(updatedDoc);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {error: "Failed to update booking"},
      {status: 500},
    );
  }
}
