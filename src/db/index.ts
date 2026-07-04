import mongoose from "mongoose";

const uri = process.env.MONGODB_URI ?? process.env.DATABASE_URL;

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsMongoose?: MongooseCache;
};

const cached = globalForDb.__arenaNextJsMongoose ?? { conn: null, promise: null };
globalForDb.__arenaNextJsMongoose = cached;

export type DbConnectionResult =
  | { ok: true }
  | { ok: false; error: string };

export function isDbConfigured() {
  return Boolean(uri);
}

export async function connectDB() {
  const result = await tryConnectDB();
  if (!result.ok) {
    throw new Error(result.error);
  }
  return cached.conn!;
}

export async function tryConnectDB(): Promise<DbConnectionResult> {
  if (cached.conn) {
    return { ok: true };
  }

  if (!uri) {
    return {
      ok: false,
      error: "MONGODB_URI is not configured. Add it in Vercel Environment Variables or .env.local.",
    };
  }

  try {
    if (!cached.promise) {
      cached.promise = mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
    }

    cached.conn = await cached.promise;
    return { ok: true };
  } catch (error) {
    cached.promise = null;
    cached.conn = null;

    const message =
      error instanceof Error ? error.message : "Failed to connect to MongoDB";

    return { ok: false, error: message };
  }
}
