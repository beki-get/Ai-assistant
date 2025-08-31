//src/components/ChatViewer.js
"use client";
import { useEffect, useState, useRef } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Box, VStack, Text, Flex, useColorModeValue } from "@chakra-ui/react";

export default function ChatViewer({ businessId, children }) {
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);
  const userBg = useColorModeValue("blue.50", "blue.900");
  const userText = useColorModeValue("blue.900", "blue.50");
  const botBg = useColorModeValue("gray.100", "gray.700");
  const botText = useColorModeValue("gray.900", "gray.100");

  useEffect(() => {
    if (!businessId) return;
    const q = query(
      collection(db, "messages", businessId, "chats"),
      orderBy("timestamp", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setMessages(list);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 0);
    });
    return () => unsub();
  }, [businessId]);

  return (
    <Box
      borderWidth="1px"
      borderRadius="md"
      p={4}
      bg={useColorModeValue("white", "gray.800")}
      maxH="60vh"
      overflowY="auto"
    >
      <VStack spacing={3} align="stretch">
        {messages.map((m) => (
          <Flex
            key={m.id}
            direction="column"
            align={m.role === "user" ? "flex-end" : "flex-start"}
          >
            <Text fontSize="xs" opacity={0.7}>
              {m.role}
            </Text>
            <Box
              bg={m.role === "user" ? userBg : botBg}
              color={m.role === "user" ? userText : botText}
              p={2}
              borderRadius="md"
              maxW="80%"
              wordBreak="break-word"
            >
              {m.content}
            </Box>
          </Flex>
        ))}
        <div ref={bottomRef} />
      </VStack>
      {children}
    </Box>
  );
}
