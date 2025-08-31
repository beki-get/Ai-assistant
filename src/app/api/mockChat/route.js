import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function POST(req) {
  try {
    const body = await req.json();
    const { message, businessId } = body;

    if (!businessId || !message) {
      return new Response(
        JSON.stringify({ error: "Missing businessId or message" }),
        { status: 400 }
      );
    }

    // Firestore path
    const chatsCollection = collection(db, "messages", businessId, "chats");

    // User message
    const userMessage = {
      content: message,
      role: "user",
      timestamp: serverTimestamp(),
      time: new Date().toLocaleTimeString(),
    };

    // Mock bot reply
    const botMessage = {
      content: `Mock reply to "${message}"`,
      role: "bot",
      timestamp: serverTimestamp(),
      time: new Date().toLocaleTimeString(),
    };

    // Save both messages
    await addDoc(chatsCollection, userMessage);
    await addDoc(chatsCollection, botMessage);

    // Return messages immediately
    return new Response(
      JSON.stringify({ success: true, messages: [userMessage, botMessage] }),
      { status: 200 }
    );
  } catch (err) {
    console.error("POST /mockChat error:", err);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
