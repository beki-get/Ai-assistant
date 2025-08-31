export async function GET() {
  const hasKey = Boolean(process.env.OPENAI_API_KEY);
  return new Response(
    JSON.stringify({ ok: true, hasOpenAI: hasKey }),
    { status: 200, headers: { "content-type": "application/json" } }
  );
}
