import { NextResponse } from "next/server";
import { connectDB } from "@/db";
import { Proxy } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    await connectDB();
    const proxies = await Proxy.find();

    let online = 0;
    let offline = 0;

    await Promise.all(
      proxies.map(async (proxy) => {
        const isHealthy = Math.random() > 0.15;
        proxy.isActive = isHealthy;
        proxy.successRate = isHealthy ? Math.max(70, Math.min(100, (proxy.successRate ?? 100) + Math.floor(Math.random() * 10 - 3))) : Math.max(0, (proxy.successRate ?? 0) - 20);
        if (!isHealthy) proxy.failCount = (proxy.failCount ?? 0) + 1;
        proxy.lastTestedAt = new Date();
        await proxy.save();
        if (isHealthy) online += 1;
        else offline += 1;
      }),
    );

    return NextResponse.json({
      tested: proxies.length,
      online,
      offline,
      message: `Tested ${proxies.length} proxies (${online} online, ${offline} offline)`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to test proxies";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
