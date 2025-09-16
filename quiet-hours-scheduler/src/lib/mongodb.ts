import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGO_URI!;
if (!uri) throw new Error("Please set MONGO_URI in .env.local");

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri);
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function getMongoDb(): Promise<Db> {
  const c = await clientPromise;
  return c.db("quiet_hours");
}

export default clientPromise;
