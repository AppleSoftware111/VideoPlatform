import { NextResponse } from "next/server";
import { connectDB } from "@/db";
import { Task } from "@/db/schema";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await connectDB();
    const { id } = await context.params;
    const body = await request.json();

    const updates: Record<string, unknown> = {};

    if (body.status !== undefined) updates.status = body.status;
    if (body.currentCount !== undefined) updates.currentCount = body.currentCount;
    if (body.name !== undefined) updates.name = body.name;

    if (body.action === "start") {
      updates.status = "running";
    } else if (body.action === "pause") {
      updates.status = "paused";
    } else if (body.action === "restart") {
      updates.status = "running";
      updates.currentCount = 0;
    }

    const task = await Task.findByIdAndUpdate(id, updates, { new: true });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

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
    const message = error instanceof Error ? error.message : "Failed to update task";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    await connectDB();
    const { id } = await context.params;
    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete task";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
