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
