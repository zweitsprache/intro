import { NextResponse } from "next/server";

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 20;
const hits = new Map<string, number[]>();

// Simple per-IP limit (per server instance); replace with login/shared store in production.
function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_REQUESTS;
}

export async function GET(request: Request) {
  const { SPEECH_KEY, SPEECH_REGION } = process.env;
  if (!SPEECH_KEY || !SPEECH_REGION) {
    return NextResponse.json({ error: "Speech nicht konfiguriert" }, { status: 503 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "local";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429 });
  }

  const response = await fetch(`https://${SPEECH_REGION}.api.cognitive.microsoft.com/sts/v1.0/issueToken`, {
    method: "POST",
    headers: { "Ocp-Apim-Subscription-Key": SPEECH_KEY },
  });
  if (!response.ok) return NextResponse.json({ error: "Token-Fehler" }, { status: 502 });

  return NextResponse.json({ token: await response.text(), region: SPEECH_REGION }, { headers: { "Cache-Control": "no-store" } });
}
