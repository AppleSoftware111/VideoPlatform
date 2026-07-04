import { pgTable, serial, text, varchar, timestamp, integer, boolean, pgEnum } from "drizzle-orm/pg-core";

export const accountStatusEnum = pgEnum("account_status", ["active", "cooldown", "banned", "pending"]);
export const proxyProtocolEnum = pgEnum("proxy_protocol", ["http", "https", "socks4", "socks5"]);
export const taskTypeEnum = pgEnum("task_type", ["view", "like", "comment", "subscribe"]);
export const taskStatusEnum = pgEnum("task_status", ["pending", "running", "completed", "failed", "paused"]);
export const logLevelEnum = pgEnum("log_level", ["DEBUG", "INFO", "WARNING", "ERROR"]);

export const accounts = pgTable("accounts", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull(),
  passwordEncrypted: text("password_encrypted").notNull(),
  status: accountStatusEnum("status").default("pending").notNull(),
  cookies: text("cookies"), // JSON string
  userAgent: text("user_agent"),
  healthScore: integer("health_score").default(100),
  lastUsedAt: timestamp("last_used_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const proxies = pgTable("proxies", {
  id: serial("id").primaryKey(),
  protocol: proxyProtocolEnum("protocol").default("http").notNull(),
  address: varchar("address", { length: 255 }).notNull(),
  port: integer("port").notNull(),
  username: varchar("username", { length: 255 }),
  password: varchar("password", { length: 255 }),
  isActive: boolean("is_active").default(true),
  failCount: integer("fail_count").default(0),
  successRate: integer("success_rate").default(100),
  lastTestedAt: timestamp("last_tested_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: taskTypeEnum("type").notNull(),
  targetUrl: text("target_url").notNull(),
  desiredCount: integer("desired_count").notNull(),
  currentCount: integer("current_count").default(0).notNull(),
  status: taskStatusEnum("status").default("pending").notNull(),
  config: text("config"), // JSON configuration (e.g., watch time, interaction delays)
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const logs = pgTable("logs", {
  id: serial("id").primaryKey(),
  taskId: integer("task_id").references(() => tasks.id),
  accountId: integer("account_id").references(() => accounts.id),
  proxyId: integer("proxy_id").references(() => proxies.id),
  level: logLevelEnum("level").default("INFO").notNull(),
  message: text("message").notNull(),
  metadata: text("metadata"), // JSON
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
