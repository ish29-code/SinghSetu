import { NextRequest, NextResponse } from "next/server";
import { getMongoDb } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const { user_id, user_email, start_time, end_time } = await req.json();

    if (!user_id || !user_email || !start_time || !end_time) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = await getMongoDb();

    await db.collection("time_blocks").insertOne({
      user_id,
      user_email, // 👈 save email too
      start_time: new Date(start_time),
      end_time: new Date(end_time),
      notified: false,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Database error:", err.message);
    return NextResponse.json({ error: "Database error saving new block" }, { status: 500 });
  }
}


