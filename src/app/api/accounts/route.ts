import { NextResponse } from "next/server";
import { connectDB } from "@/db";
import { Account } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const accounts = await Account.find().sort({ createdAt: 1 }).lean();
    return NextResponse.json({
      accounts: accounts.map((account) => ({
        id: account._id.toString(),
        username: account.username,
        status: account.status,
        healthScore: account.healthScore ?? 0,
        lastUsedAt: account.lastUsedAt?.toISOString() ?? null,
      })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load accounts";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const username = String(body.username ?? "").trim();

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    const account = await Account.create({
      username,
      passwordEncrypted: body.passwordEncrypted ?? "aes:256:pending",
      status: body.status ?? "pending",
      userAgent: body.userAgent ?? "Mozilla/5.0",
      healthScore: body.healthScore ?? 100,
    });

    return NextResponse.json({
      account: {
        id: account.id,
        username: account.username,
        status: account.status,
        healthScore: account.healthScore,
        lastUsedAt: account.lastUsedAt?.toISOString() ?? null,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create account";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
