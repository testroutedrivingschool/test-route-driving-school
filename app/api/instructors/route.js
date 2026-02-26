import {admin} from "@/app/libs/firebase/firebase.admin";
import {
  instructorsCollection,
  usersCollection,
  clientsCollection,
} from "@/app/libs/mongodb/db";
import {NextResponse} from "next/server";

// GET - get all instructors or filter by email
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("email");
    const status = url.searchParams.get("status");

    const query = {};

    if (email) {
      query.email = email;
    }

    if (status) {
      query.status = status; 
    }

    const collection = await instructorsCollection();

    // If filtering by email (single result expected)
    if (email) {
      const instructor = await collection.findOne(query);
      if (!instructor) {
        return NextResponse.json(
          { error: "Instructor not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(instructor);
    }

   
    const instructors = await collection.find(query).toArray();

    return NextResponse.json(instructors);

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
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
        {status: 400},
      );
    }

    const collection = await instructorsCollection();

    // 🔍 Check if instructor already exists
    const existingInstructor = await collection.findOne({email});

    if (existingInstructor) {
      return NextResponse.json(
        {error: "Instructor already registered with this email"},
        {status: 409},
      );
    }

    const result = await collection.insertOne({
      ...body,
      createdAt: new Date(),
    });

    return NextResponse.json(
      {message: "Instructor registered successfully", result},
      {status: 201},
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

      // basic profile (shared)
      name,
      phone,
      homePhone,
      workPhone,
      dob, 
      dateOfBirth, 
      emergencyContact,
      address,
      suburb,
      state,
      postCode,

      // instructor-only fields
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
      services,

      // photo fields
      photoKey,
      photo,
    } = body;

    if (!email) {
      return NextResponse.json({error: "Email is required"}, {status: 400});
    }

    const instructorUpdate = {};
    const setIfDefined = (obj, key, val) => {
      if (val !== undefined) obj[key] = val; // allow "" to clear
    };

    // ===== 1) Instructor update (full) =====
    setIfDefined(instructorUpdate, "name", name);
    setIfDefined(instructorUpdate, "phone", phone);
    setIfDefined(instructorUpdate, "homePhone", homePhone);
    setIfDefined(instructorUpdate, "workPhone", workPhone);

    // accept either dob or dateOfBirth from frontend
    setIfDefined(
      instructorUpdate,
      "dob",
      dob !== undefined ? dob : dateOfBirth,
    );

    setIfDefined(instructorUpdate, "emergencyContact", emergencyContact);
    setIfDefined(instructorUpdate, "address", address);
    setIfDefined(instructorUpdate, "suburb", suburb);
    setIfDefined(instructorUpdate, "state", state);
    setIfDefined(instructorUpdate, "postCode", postCode);

    setIfDefined(instructorUpdate, "vehicleModel", vehicleModel);
    setIfDefined(instructorUpdate, "abn", abn);
    setIfDefined(instructorUpdate, "licencePlate", licencePlate);
    setIfDefined(instructorUpdate, "carInsuranceNumber", carInsuranceNumber);
    setIfDefined(instructorUpdate, "carInsuranceExpiry", carInsuranceExpiry);

    setIfDefined(instructorUpdate, "qualifications", qualifications);
    setIfDefined(instructorUpdate, "bio", bio);
    setIfDefined(instructorUpdate, "suburbs", suburbs);
    setIfDefined(instructorUpdate, "languages", languages);
    setIfDefined(instructorUpdate, "status", status);
    setIfDefined(instructorUpdate, "emailScheduleTime", emailScheduleTime);
    setIfDefined(instructorUpdate, "services", services);

    setIfDefined(instructorUpdate, "photoKey", photoKey);
    setIfDefined(instructorUpdate, "photo", photo);

    const instructorCol = await instructorsCollection();
    const userCol = await usersCollection();

    const instructorRes = await instructorCol.updateOne(
      {email},
      {$set: instructorUpdate},
    );

    if (instructorRes.matchedCount === 0) {
      return NextResponse.json({error: "Instructor not found"}, {status: 404});
    }

    // ===== 2) User update (ONLY basic fields) =====
    const userUpdate = {};
    const setUser = (key, val) => {
      if (val !== undefined) userUpdate[key] = val;
    };

    setUser("name", name);
    setUser("phone", phone);
    setUser("homePhone", homePhone);
    setUser("workPhone", workPhone);
    setUser("emergencyContact", emergencyContact);
    setUser("address", address);
    setUser("bio",bio);
    setUser("suburb", suburb);
    setUser("state", state);
    setUser("postCode", postCode);
    setUser("emailScheduleTime", emailScheduleTime);
    setUser("bio", bio);
setUser("qualifications", qualifications);
setUser("abn", abn);
setUser("vehicleModel", vehicleModel);
setUser("licencePlate", licencePlate);
setUser("carInsuranceNumber", carInsuranceNumber);
setUser("carInsuranceExpiry", carInsuranceExpiry);
setUser("languages", languages);

    if (dob !== undefined) setUser("dateOfBirth", dob);
    if (dateOfBirth !== undefined) setUser("dateOfBirth", dateOfBirth);

    setUser("photoKey", photoKey);
    setUser("photo", photo);

    // ✅ update users by userId (best)
    if (Object.keys(userUpdate).length > 0) {
      const instructorDoc = await instructorCol.findOne({email});

      if (instructorDoc?.userId) {
        const {ObjectId} = await import("mongodb");
        await userCol.updateOne(
          {_id: new ObjectId(instructorDoc.userId)},
          {$set: userUpdate},
        );
      } else {
        // fallback (if userId missing)
        await userCol.updateOne({email}, {$set: userUpdate});
      }
    }

    // ===== 3) Role sync (your existing logic) =====
    if (status !== undefined) {
      const role = status === "approved" ? "instructor" : "user";
      await userCol.updateOne({email}, {$set: {role}});
    }
   if (status === "approved") {
      const instructorDoc = await instructorCol.findOne({email});
      if (instructorDoc?._id) {
        const instructorId = instructorDoc._id.toString();
        await userCol.updateOne(
          {email},
          {$set: {instructorId}} // Add instructorId to the user's document
        );
      }
    }

    // ===== 4) Clients sync: roleType = staff when approved =====
    if (status !== undefined) {
      const clientsCol = await clientsCollection();
      const emailLower = email.toLowerCase();

      if (status === "approved") {
        // ✅ mark client record as staff (keep same doc, just change type)
        await clientsCol.updateOne(
          {email: emailLower},
          {
            $set: {
              roleType: "staff",
              updatedAt: new Date(),
            },
          },
          {upsert: true}, // if client doc missing, create minimal one
        );
      } else {
        
        await clientsCol.updateOne(
          {email: emailLower},
          {
            $set: {
              roleType: "client",
              staffRole: null,
              updatedAt: new Date(),
            },
          },
        );
      }
    }

    return NextResponse.json({
      message: "Instructor updated + basic user profile synced",
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
