import express, { Request, Response } from "express";
import { MongoClient } from "mongodb";
import nodemailer from "nodemailer";

const client = new MongoClient(process.env.MONGO_URI!);

async function main() {
  await client.connect();
  const db = client.db("quiet_hours");

  async function sendEmail(to: string, startTime: Date) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: "Quiet Hours Reminder",
      text: `Your quiet hour starts at ${startTime.toLocaleTimeString()}`,
    });
  }

  const app = express();

  // 👇 Add Request, Response types here
  app.get("/", async (req: Request, res: Response) => {
    const now = new Date();
    const inTenMins = new Date(now.getTime() + 10 * 60 * 1000);

    const blocks = await db.collection("time_blocks").find({
      start_time: { $lte: inTenMins, $gte: now },
      notified: false,
    }).toArray();

    for (const block of blocks) {
      if (block.user_email) {
        await sendEmail(block.user_email, block.start_time);
      }
      await db.collection("time_blocks").updateOne(
        { _id: block._id },
        { $set: { notified: true } }
      );
    }

    res.send("Checked blocks & sent reminders");
  });

  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });
}

main().catch(console.error);
