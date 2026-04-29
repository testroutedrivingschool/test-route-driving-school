import {admin} from "@/app/libs/firebase/firebase.admin";
import {clientsCollection, usersCollection} from "@/app/libs/mongodb/db";
import { ObjectId } from "mongodb";
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
    return NextResponse.json({error: "Something went wrong"}, {status: 500});
  }
}

export async function POST(req) {
  const body = await req.json();
  body.emailScheduleTime = "00:00";
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
      emailScheduleTime,
      clientId,
    } = body;

    if (!email)
      return NextResponse.json({error: "Email is required"}, {status: 400});

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth;

    if (emergencyContact !== undefined)
      updateData.emergencyContact = emergencyContact;
    if (address !== undefined) updateData.address = address;
    if (suburb !== undefined) updateData.suburb = suburb;
    if (state !== undefined) updateData.state = state;
    if (postCode !== undefined) updateData.postCode = postCode;
    if (role !== undefined) updateData.role = role;

    // ✅ profile photo updates
    if (photoKey !== undefined) updateData.photoKey = photoKey;
    if (photo !== undefined) updateData.photo = photo;
    if (emailScheduleTime !== undefined) {
      const v = String(emailScheduleTime).trim();
      const ok = /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
      if (!ok) {
        return NextResponse.json(
          {error: "emailScheduleTime must be HH:MM (24h) like 07:48 or 21:55"},
          {status: 400},
        );
      }
      updateData.emailScheduleTime = v;
    }
    const result = await (
      await usersCollection()
    ).updateOne({email}, {$set: updateData});

    if (result.matchedCount === 0) {
      return NextResponse.json({error: "User not found"}, {status: 404});
    }


    if (clientId && ObjectId.isValid(clientId)) {
  const clientsCol = await clientsCollection();

  const clientUpdateResult = await clientsCol.updateOne(
    { _id: new ObjectId(clientId) },
    {
      $set: {
        mobile: phone || "",
        address: address || "",
        suburb: suburb || "",
        state: state || "",
        postCode: postCode || "",
        updatedAt: new Date(),
      },
    }
  );

  if (clientUpdateResult.matchedCount === 0) {
    console.warn(`No client found with the clientId: ${clientId}`);
  }
}

    return NextResponse.json({message: "User updated successfully"});
  } catch (error) {
    return NextResponse.json({error: "Something went wrong"}, {status: 500});
  }
}


export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const usersCol = await usersCollection();

    // 🔥 STEP 1: find user first (IMPORTANT)
    const user = await usersCol.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 🔥 STEP 2: delete linked client (if exists)
    if (user.clientId && ObjectId.isValid(user.clientId)) {
      const clientsCol = await clientsCollection();

      await clientsCol.deleteOne({
        _id: new ObjectId(user.clientId),
      });
    }

    // 🔥 STEP 3: delete user from DB
    await usersCol.deleteOne({ email });

    // 🔥 STEP 4: delete from Firebase
    try {
      const userRecord = await admin.auth().getUserByEmail(email);
      await admin.auth().deleteUser(userRecord.uid);
    } catch (err) {
      console.warn("User not found in Firebase, skipping deletion");
    }

    return NextResponse.json({
      message: "User + client deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// export async function DELETE(req) {
//   try {
//     const url = new URL(req.url);
//     const email = url.searchParams.get("email");
//     if (!email)
//       return NextResponse.json({error: "Email required"}, {status: 400});

//     // Delete from MongoDB
//     const result = await (await usersCollection()).deleteOne({email});
//     if (result.deletedCount === 0)
//       return NextResponse.json({error: "User not found"}, {status: 404});

//     // Delete from Firebase Auth
//     try {
//       const userRecord = await admin.auth().getUserByEmail(email);
//       await admin.auth().deleteUser(userRecord.uid);
//     } catch (err) {
//       console.warn("User not found in Firebase, skipping deletion");
//     }

//     return NextResponse.json({message: "User deleted from DB and Firebase"});
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({error: "Something went wrong"}, {status: 500});
//   }
// }
