export const runtime = "nodejs";

import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, query, getDocs, where, orderBy } from "firebase/firestore";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAIKey = process.env.GEMINI_API_KEY;
const modelName = "gemini-1.5-flash";

// POST: customer sends message to AI chatbot
export async function POST(req) {
  try {
    const { businessId, message, context = {} } = await req.json();

    if (!businessId || !message) {
      return new Response(JSON.stringify({ error: "Missing businessId or message" }), { status: 400 });
    }

    // Build context block for AI prompt
    const contextBlock = Object.entries(context)
      .filter(([_, v]) => !!v)
      .map(([k, v]) => `${k}: ${typeof v === "string" ? v : JSON.stringify(v)}`)
      .join("\n");

    const prompt = `You are a helpful assistant for a local business.\n` +
                   (contextBlock ? `BUSINESS INFO:\n${contextBlock}\n` : "") +
                   `USER: ${message}\nASSISTANT:`;

    let botText = `Thanks! I received your message: "${message}". How can I help further?`;

    // Call Gemini AI
    try {
      if (genAIKey) {
        const genAI = new GoogleGenerativeAI(genAIKey);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const txt = result?.response?.text?.();
        if (txt && typeof txt === "string") botText = txt.trim();
      }
    } catch (aiErr) {
      console.error("Gemini AI error:", aiErr);
      // keep fallback text
    }

    // Save bot reply to Firestore under businessId
    const chatsCollection = collection(db, "messages", businessId, "chats");
    const botMessage = {
      content: botText,
      role: "bot",
      timestamp: serverTimestamp(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    await addDoc(chatsCollection, botMessage);

    // Save user message as well
    const userMessage = {
      content: message,
      role: "user",
      timestamp: serverTimestamp(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    await addDoc(chatsCollection, userMessage);

    return new Response(JSON.stringify({ success: true, botMessage }), { status: 200 });
  } catch (err) {
    console.error("POST /api/chat error:", err);
    return new Response(JSON.stringify({
      success: true,
      botMessage: {
        content: "Sorry, I’m having trouble right now. I’ve logged this issue.",
        role: "bot",
        timestamp: new Date().toISOString(),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        _meta: { error: err?.message ?? String(err) },
      }
    }), { status: 200 });
  }
}

// GET: fetch chat history for a specific business
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get("businessId");

    if (!businessId) {
      return new Response(JSON.stringify({ error: "Missing businessId" }), { status: 400 });
    }

    const chatsQuery = query(
      collection(db, "messages", businessId, "chats"),
      orderBy("timestamp", "asc")
    );

    const snapshot = await getDocs(chatsQuery);
    const chats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return new Response(JSON.stringify({ success: true, chats }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
