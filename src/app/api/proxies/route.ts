import { NextResponse } from "next/server";
import { connectDB } from "@/db";
import { Proxy } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const rawList = String(body.list ?? "").trim();

    if (!rawList) {
      return NextResponse.json({ error: "Proxy list is required" }, { status: 400 });
    }

    const lines = rawList.split("\n").map((line) => line.trim()).filter(Boolean);
    const proxies = lines.map((line) => {
      const [addressPart, portPart] = line.includes(":") ? line.split(":") : [line, "8080"];
      return {
        protocol: body.protocol ?? "http",
        address: addressPart.trim(),
        port: Number(portPart.trim()) || 8080,
        isActive: true,
        successRate: 100,
        failCount: 0,
      };
    });

    const created = await Proxy.insertMany(proxies);

    return NextResponse.json({
      count: created.length,
      message: `Added ${created.length} proxies`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to add proxies";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
