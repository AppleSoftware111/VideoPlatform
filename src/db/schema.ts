import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const accountSchema = new Schema(
  {
    username: { type: String, required: true },
    passwordEncrypted: { type: String, required: true },
    status: {
      type: String,
      enum: ["active", "cooldown", "banned", "pending"],
      default: "pending",
    },
    cookies: String,
    userAgent: String,
    healthScore: { type: Number, default: 100 },
    lastUsedAt: Date,
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

const proxySchema = new Schema(
  {
    protocol: {
      type: String,
      enum: ["http", "https", "socks4", "socks5"],
      default: "http",
    },
    address: { type: String, required: true },
    port: { type: Number, required: true },
    username: String,
    password: String,
    isActive: { type: Boolean, default: true },
    failCount: { type: Number, default: 0 },
    successRate: { type: Number, default: 100 },
    lastTestedAt: Date,
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

const taskSchema = new Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["view", "like", "comment", "subscribe"],
      required: true,
    },
    targetUrl: { type: String, required: true },
    desiredCount: { type: Number, required: true },
    currentCount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "running", "completed", "failed", "paused"],
      default: "pending",
    },
    config: String,
  },
  { timestamps: true },
);

const logSchema = new Schema(
  {
    taskId: { type: Schema.Types.ObjectId, ref: "Task" },
    accountId: { type: Schema.Types.ObjectId, ref: "Account" },
    proxyId: { type: Schema.Types.ObjectId, ref: "Proxy" },
    level: {
      type: String,
      enum: ["DEBUG", "INFO", "WARNING", "ERROR"],
      default: "INFO",
    },
    message: { type: String, required: true },
    metadata: String,
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export type Account = InferSchemaType<typeof accountSchema> & { _id: mongoose.Types.ObjectId };
export type Proxy = InferSchemaType<typeof proxySchema> & { _id: mongoose.Types.ObjectId };
export type Task = InferSchemaType<typeof taskSchema> & { _id: mongoose.Types.ObjectId };
export type Log = InferSchemaType<typeof logSchema> & { _id: mongoose.Types.ObjectId };

export const Account =
  (mongoose.models.Account as Model<Account>) ?? mongoose.model<Account>("Account", accountSchema);
export const Proxy =
  (mongoose.models.Proxy as Model<Proxy>) ?? mongoose.model<Proxy>("Proxy", proxySchema);
export const Task =
  (mongoose.models.Task as Model<Task>) ?? mongoose.model<Task>("Task", taskSchema);
export const Log =
  (mongoose.models.Log as Model<Log>) ?? mongoose.model<Log>("Log", logSchema);
