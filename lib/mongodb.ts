import { MongoClient } from "mongodb";

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient> | null = null;

export function getMongoClientPromise(): Promise<MongoClient> | null {
  const uri = process.env.MONGODB_URI;
  if (!uri) return null;

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri);
      global._mongoClientPromise = client.connect().catch((err) => {
        global._mongoClientPromise = undefined;
        throw err;
      });
    }
    return global._mongoClientPromise;
  } else {
    if (!clientPromise) {
      const client = new MongoClient(uri);
      clientPromise = client.connect().catch((err) => {
        clientPromise = null;
        throw err;
      });
    }
    return clientPromise;
  }
}

export async function getMongoDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) return null;
  const promise = getMongoClientPromise();
  if (!promise) return null;
  try {
    const client = await promise;
    const dbName = process.env.MONGODB_DB || "portfolio";
    return client.db(dbName);
  } catch (err) {
    console.error("MongoDB connection error:", err);
    clientPromise = null;
    if (global._mongoClientPromise) global._mongoClientPromise = undefined;
    throw err;
  }
}

export async function checkMongoConnection(): Promise<{ connected: boolean; error?: string }> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return {
      connected: false,
      error: "MONGODB_URI is not defined in environment variables. If you just added it in Vercel, remember to click Redeploy.",
    };
  }

  try {
    const db = await getMongoDb();
    if (!db) return { connected: false, error: "Unable to initialize MongoDB client." };
    await db.command({ ping: 1 });
    return { connected: true };
  } catch (err: any) {
    return {
      connected: false,
      error: err?.message || "Failed to ping MongoDB Atlas. Check your password and Network Access (0.0.0.0/0).",
    };
  }
}
