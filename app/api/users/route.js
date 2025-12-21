import {usersCollection} from "@/app/libs/mongodb/db";
import {NextResponse} from "next/server";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("email");

    if (email) {
      // Find one user by email
      const user = await (await usersCollection()).findOne({email});

      if (!user) {
        return NextResponse.json({error: "User not found"}, {status: 404});
      }

      return NextResponse.json(user);
    } else {
      // Return all users if no email query
      const users = await (await usersCollection()).find().toArray();
      return NextResponse.json(users);
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({error: "Something went wrong"}, {status: 500});
  }
}

export async function POST(req) {
  const body = await req.json();

  const result = await (await usersCollection()).insertOne(body);

  return NextResponse.json(result, {status: 201});
}


export async function PATCH(req) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required to update lastLogin" },
        { status: 400 }
      );
    }

    const result = await (await usersCollection()).updateOne(
      { email },
      { $set: { lastLogin: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Last login updated successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}