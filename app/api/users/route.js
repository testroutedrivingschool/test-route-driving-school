import {admin} from "@/app/libs/firebase/firebase.admin";
import {usersCollection} from "@/app/libs/mongodb/db";
import {NextResponse} from "next/server";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("email");
    const role = url.searchParams.get("role"); 

    const query = {};

    if (email) {
      query.email = email;
    }

    if (role) {
      query.role = role; // filter by role
    }

    const collection = await usersCollection();

    if (email) {
      const user = await collection.findOne(query);
      if (!user) {
        return NextResponse.json({error: "User not found"}, {status: 404});
      }
      return NextResponse.json(user);
    } else {
      const users = await collection.find(query).toArray();
      return NextResponse.json(users);
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({error: "Something went wrong"}, {status: 500});
  }
}

export async function POST(req) {
  const body = await req.json();
  body.emailScheduleTime= "00:00";
  const result = await (await usersCollection()).insertOne(body);

  return NextResponse.json(result, {status: 201});
}

export async function PATCH(req) {
  try {
    const body = await req.json();
    const {
      email,
      name,
      phone,
      dateOfBirth,
      emergencyContact,
      address,
      suburb,
      state,
      postCode,
      role,
      photoKey,  
      photo,    
    } = body;

    if (!email)
      return NextResponse.json({ error: "Email is required" }, { status: 400 });

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;
    if (emergencyContact) updateData.emergencyContact = emergencyContact;
    if (address) updateData.address = address;
    if (suburb) updateData.suburb = suburb;
    if (state) updateData.state = state;
    if (postCode) updateData.postCode = postCode;
    if (role) updateData.role = role;

    // ✅ profile photo updates
    if (photoKey !== undefined) updateData.photoKey = photoKey; // allow empty too
    if (photo !== undefined) updateData.photo = photo; // allow empty too

    const result = await (await usersCollection()).updateOne(
      { email },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User updated successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}



export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("email");
    if (!email)
      return NextResponse.json({error: "Email required"}, {status: 400});

    // Delete from MongoDB
    const result = await (await usersCollection()).deleteOne({email});
    if (result.deletedCount === 0)
      return NextResponse.json({error: "User not found"}, {status: 404});

    // Delete from Firebase Auth
    try {
      const userRecord = await admin.auth().getUserByEmail(email);
      await admin.auth().deleteUser(userRecord.uid);
    } catch (err) {
      console.warn("User not found in Firebase, skipping deletion");
    }

    return NextResponse.json({message: "User deleted from DB and Firebase"});
  } catch (err) {
    console.error(err);
    return NextResponse.json({error: "Something went wrong"}, {status: 500});
  }
}
