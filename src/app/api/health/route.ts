import { isDbConfigured, tryConnectDB } from "@/db";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isDbConfigured()) {
    return Response.json(
      {
        ok: false,
        error: "MONGODB_URI is not configured",
      },
      { status: 503 },
    );
  }

  const result = await tryConnectDB();

  if (!result.ok) {
    return Response.json(
      {
        ok: false,
        error: result.error,
      },
      { status: 503 },
    );
  }

  return Response.json({ ok: true });
}
