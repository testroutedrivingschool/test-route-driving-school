import { NextResponse } from "next/server";
import { usersCollection, instructorsCollection } from "@/app/libs/mongodb/db";

const pick = (obj, keys) =>
  keys.reduce((acc, k) => {
    if (obj?.[k] !== undefined) acc[k] = obj[k];
    return acc;
  }, {});

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const userCol = await usersCollection();
    const instCol = await instructorsCollection();

    const user = await userCol.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const instructor = await instCol.findOne({ email }); // may be null

    // ✅ Choose only necessary fields (no suburbs/services/_id)
    const baseUser = pick(user, [
      "name",
      "email",
      "phone",
      "homePhone",
      "workPhone",
      "provider",
      "role",
      "photo",
      "photoKey",
      "dateOfBirth",
      "emergencyContact",
      "address",
      "suburb",
      "state",
      "postCode",
      "emailScheduleTime",
    ]);

    const inst = instructor
      ? pick(instructor, [
          "bio",
          "qualifications",
          "languages",
          "abn",
          "vehicleModel",
          "licencePlate",
          "carInsuranceNumber",
          "carInsuranceExpiry",
          "status",
        ])
      : {};

    // ✅ Merge: instructor overrides user if present
    const merged = {
      ...baseUser,
      ...inst,
      instructorStatus: instructor?.status ?? null,
    };

    // ✅ Force plain JSON (avoids BSON / Date clone issues)
    return NextResponse.json(JSON.parse(JSON.stringify(merged)));
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
