import {admin} from "@/app/libs/firebase/firebase.admin";
import {instructorsCollection, usersCollection} from "@/app/libs/mongodb/db";
import {NextResponse} from "next/server";

// GET - get all instructors or filter by email
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("email");

    const query = {};
    if (email) query.email = email;

    const collection = await instructorsCollection();

    if (email) {
      const instructor = await collection.findOne(query);
      if (!instructor) {
        return NextResponse.json(
          {error: "Instructor not found"},
          {status: 404}
        );
      }
      return NextResponse.json(instructor);
    } else {
      const instructors = await collection.find(query).toArray();
      return NextResponse.json(instructors);
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({error: "Something went wrong"}, {status: 500});
  }
}

// POST - add a new instructor
export async function POST(req) {
  try {
    const body = await req.json();
    const {name, email} = body;

    if (!name || !email) {
      return NextResponse.json(
        {error: "Name and email are required"},
        {status: 400}
      );
    }

    const collection = await instructorsCollection();

    // 🔍 Check if instructor already exists
    const existingInstructor = await collection.findOne({email});

    if (existingInstructor) {
      return NextResponse.json(
        {error: "Instructor already registered with this email"},
        {status: 409}
      );
    }

    const result = await collection.insertOne({
      ...body,
      createdAt: new Date(),
    });

    return NextResponse.json(
      {message: "Instructor registered successfully", result},
      {status: 201}
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({error: "Something went wrong"}, {status: 500});
  }
}

export async function PATCH(req) {
  try {
    const body = await req.json();
    const {
      email,
      name,
      phone,
      homePhone,
      workPhone,
      dob,
      emergencyContact,
      address,
      suburb,
      state,
      postCode,
      abn,
      licencePlate,
      vehicleModel,
      carInsuranceNumber,
      carInsuranceExpiry,
      qualifications,
      bio,
      suburbs,
      languages,
      status,
      emailScheduleTime,
    } = body;

    if (!email) {
      return NextResponse.json({error: "Email is required"}, {status: 400});
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (homePhone) updateData.homePhone = homePhone;
    if (workPhone) updateData.workPhone = workPhone;
    if (dob) updateData.dob = dob;
    if (emergencyContact) updateData.emergencyContact = emergencyContact;
    if (address) updateData.address = address;
    if (suburb) updateData.suburb = suburb;
    if (state) updateData.state = state;
    if (postCode) updateData.postCode = postCode;
    if(vehicleModel) updateData.vehicleModel = vehicleModel;
    if (abn) updateData.abn = abn;
    if (licencePlate) updateData.licencePlate = licencePlate;
    if (carInsuranceNumber) updateData.carInsuranceNumber = carInsuranceNumber;
    if (carInsuranceExpiry) updateData.carInsuranceExpiry = carInsuranceExpiry;

    if (qualifications) updateData.qualifications = qualifications;
    if (bio) updateData.bio = bio;
    if (suburbs) updateData.suburbs = suburbs;
    if (languages) updateData.languages = languages;
    if (status) updateData.status = status;
    if (emailScheduleTime) updateData.emailScheduleTime = emailScheduleTime;

    const instructorCol = await instructorsCollection();

    const result = await instructorCol.updateOne({email}, {$set: updateData});

    if (result.matchedCount === 0) {
      return NextResponse.json({error: "Instructor not found"}, {status: 404});
    }

    /* ===============================
       🔥 ROLE SYNC LOGIC (IMPORTANT)
    =============================== */
    if (status) {
      const userCol = await usersCollection();

      const role = status === "approved" ? "instructor" : "user";

      await userCol.updateOne({email}, {$set: {role}});
    }

    return NextResponse.json({
      message: "Instructor updated successfully",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({error: "Something went wrong"}, {status: 500});
  }
}

// DELETE - delete instructor by email
export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("email");
    if (!email)
      return NextResponse.json({error: "Email required"}, {status: 400});

    const collection = await instructorsCollection();
    const result = await collection.deleteOne({email});

    if (result.deletedCount === 0) {
      return NextResponse.json({error: "Instructor not found"}, {status: 404});
    }

    // Optional: delete from Firebase Auth if you store instructor as user
    try {
      const userRecord = await admin.auth().getUserByEmail(email);
      await admin.auth().deleteUser(userRecord.uid);
    } catch (err) {
      console.warn("Instructor not found in Firebase, skipping deletion");
    }

    return NextResponse.json({
      message: "Instructor deleted from DB and Firebase",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({error: "Something went wrong"}, {status: 500});
  }
}
