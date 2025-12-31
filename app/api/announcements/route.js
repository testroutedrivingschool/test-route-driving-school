
import { announcementsCollection } from "@/app/libs/mongodb/db";
import { NextResponse } from "next/server";

// GET all announcements
export async function GET() {
  try {
    const announcements = await (await announcementsCollection()).find().toArray();
    return NextResponse.json(announcements);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch announcements" }, { status: 500 });
  }
}

//POST
export async function POST(req) {
  try {
    const body = await req.json();
    const { title, message } = body;

    
    if (!title || !message) {
      return NextResponse.json({ error: "Missing title or Message" }, { status: 400 });
    }

    const result = await (await announcementsCollection()).insertOne({
      title,
      message,
      createdAt: new Date(),
    });

    return NextResponse.json({ message: "Announcement created successfully", id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create announcement" }, { status: 500 });
  }
}


// DELETE 
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing announcement ID" }, { status: 400 });
    }

    const result = await (await announcementsCollection()).deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Announcement not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Announcement deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete announcement" }, { status: 500 });
  }
}
