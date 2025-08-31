//src/components/ChatBox.js
"use client";
import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { Flex, Input, Button,useColorModeValue  } from "@chakra-ui/react";

export default function ChatBox({ businessId, onNewMessages }) {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim() || !businessId || !user) return;

    setLoading(true);
    const text = message.trim();
    setMessage("");

    try {
      const userMsg = {
        content: text,
        role: "user",
        userId: user.uid,
        userEmail: user.email || null,
        userName: user.displayName || null,
        businessId,
        timestamp: serverTimestamp(),
      };
      await addDoc(collection(db, "messages", businessId, "chats"), userMsg);
      if (onNewMessages) onNewMessages([userMsg]);

      await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId, message: text }),
      });
    } catch (err) {
      console.error("Send failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !loading) handleSend();
  };

  return (
    <Flex mt={4} gap={2}>
      <Input
        placeholder={user ? "Type your message..." : "Login to chat"}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={onKeyDown}
        flex="1"
        isDisabled={loading || !user}
        bg={useColorModeValue("gray.50", "gray.700")}
      />
      <Button
        colorScheme="blue"
        onClick={handleSend}
        isLoading={loading}
        isDisabled={!user}
      >
        Send
      </Button>
    </Flex>
  );
}
