import { NextResponse } from "next/server";
import { connectDB } from "@/db";
import { Account } from "@/db/schema";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await connectDB();
    const { id } = await context.params;
    const body = await request.json();

    const account = await Account.findByIdAndUpdate(
      id,
      {
        ...(body.username !== undefined ? { username: body.username } : {}),
        ...(body.status !== undefined ? { status: body.status } : {}),
        ...(body.healthScore !== undefined ? { healthScore: body.healthScore } : {}),
        ...(body.lastUsedAt !== undefined ? { lastUsedAt: body.lastUsedAt } : {}),
      },
      { new: true },
    );

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

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
    const message = error instanceof Error ? error.message : "Failed to update account";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    await connectDB();
    const { id } = await context.params;
    const account = await Account.findByIdAndDelete(id);

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete account";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
