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

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!uri) {
    throw new Error("MONGODB_URI is required");
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
