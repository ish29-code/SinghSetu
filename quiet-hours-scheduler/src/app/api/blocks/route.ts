import { NextRequest, NextResponse } from "next/server";
import { getMongoDb } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const user_id = req.nextUrl.searchParams.get("user_id");
    if (!user_id) return NextResponse.json([]);

    const db = await getMongoDb();
    const blocks = await db.collection("time_blocks")
      .find({ user_id })
      .sort({ start_time: 1 })
      .toArray();

    return NextResponse.json(blocks);
  } catch (err) {
    console.error("fetch blocks error:", err);
    return NextResponse.json([]);
  }
}
