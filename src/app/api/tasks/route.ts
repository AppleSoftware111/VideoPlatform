import { NextResponse } from "next/server";
import { connectDB } from "@/db";
import { Task } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    const name = String(body.name ?? "").trim();
    const targetUrl = String(body.targetUrl ?? "").trim();
    const type = body.type ?? "view";
    const desiredCount = Number(body.desiredCount ?? 100);

    if (!name || !targetUrl) {
      return NextResponse.json({ error: "Name and target URL are required" }, { status: 400 });
    }

    const task = await Task.create({
      name,
      type,
      targetUrl,
      desiredCount,
      currentCount: 0,
      status: "pending",
      config: body.config ?? "{}",
    });

    return NextResponse.json({
      task: {
        id: task.id,
        name: task.name,
        type: task.type,
        targetUrl: task.targetUrl,
        desiredCount: task.desiredCount,
        currentCount: task.currentCount,
        status: task.status,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create task";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
