import { NextRequest, NextResponse } from "next/server";
import { getMongoDb } from "@/lib/mongodb";

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY!;
const CRON_SECRET = process.env.CRON_SECRET!;

async function sendEmail(to: string, subject: string, text: string) {
  const body = {
    personalizations: [{ to: [{ email: to }] }],
    from: { email: "noreply@quiet-hours.app" },
    subject,
    content: [{ type: "text/plain", value: text }],
  };

  await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SENDGRID_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

export async function GET(req: NextRequest) {
  try {
    const secret = req.nextUrl.searchParams.get("secret");
    if (secret !== CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getMongoDb();
    const now = new Date();
    const inTen = new Date(now.getTime() + 10 * 60 * 1000);

    const candidates = await db.collection("time_blocks").find({
      start_time: { $gte: now, $lte: inTen },
      notified: false,
    }).toArray();

    for (const block of candidates) {
      const updated = await db.collection("time_blocks").findOneAndUpdate(
        { _id: block._id, notified: false },
        { $set: { notified: true } }
      );

      if (updated && updated.value) {
        await sendEmail(
          block.user_email,
          "Quiet Hours Reminder",
          `Your quiet hour starts at ${new Date(block.start_time).toLocaleString()}`
        );
      }
    }

    return NextResponse.json({ ok: true, checked: candidates.length });
  } catch (err) {
    console.error("cron error:", err);
    return NextResponse.json({ error: "Internal" }, { status: 500 });
  }
}
