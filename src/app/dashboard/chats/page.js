'use client'

import React, { useEffect, useMemo, useState, useRef } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import {
  Box,
  Flex,
  VStack,
  HStack,
  Select,
  Text,
  Input,
  Button,
  Skeleton,
  Spacer,
  Divider,
  useToast,
} from "@chakra-ui/react";

function tsToDate(ts) {
  if (!ts) return null;
  if (typeof ts.toDate === "function") return ts.toDate();
  if (typeof ts === "number") return new Date(ts);
  if (typeof ts.seconds === "number") return new Date(ts.seconds * 1000);
  return null;
}

export default function DashboardChatsPage() {
  const toast = useToast();
  const [businessIds, setBusinessIds] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState("");
  const [docArrayMsgs, setDocArrayMsgs] = useState([]);
  const [chatDocsMsgs, setChatDocsMsgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMsg, setNewMsg] = useState("");
  const scrollRef = useRef(null);

  // Load business IDs
  useEffect(() => {
    (async () => {
      const snap = await getDocs(collection(db, "messages"));
      const ids = snap.docs.map((d) => d.id).sort();
      setBusinessIds(ids);
      if (ids.length && !selectedBusiness) setSelectedBusiness(ids[0]);
    })();
  }, []);

  // Listen to messages for selected business
  useEffect(() => {
    if (!selectedBusiness) return;
    setLoading(true);

    const unsubDoc = onSnapshot(doc(db, "messages", selectedBusiness), (docSnap) => {
      if (!docSnap.exists()) {
        setDocArrayMsgs([]);
        return;
      }
      const data = docSnap.data() || {};
      const arr = Array.isArray(data.messages)
        ? data.messages.map((m, i) => ({
            id: `arr-${i}`,
            role: m.role || m.sender || "unknown",
            content: m.content || m.text || "",
            ts: tsToDate(m.timestamp || m.createdAt),
            fallbackTime: m.time || "",
            source: "array",
          }))
        : [];
      setDocArrayMsgs(arr);
    });

    const q = query(
      collection(db, "messages", selectedBusiness, "chats"),
      orderBy("timestamp", "asc")
    );
    const unsubChats = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => {
        const m = d.data();
        return {
          id: d.id,
          role: m.role || m.sender || "unknown",
          content: m.content || m.text || "",
          ts: tsToDate(m.timestamp || m.createdAt),
          fallbackTime: m.time || "",
          source: "chatDoc",
        };
      });
      setChatDocsMsgs(list);
      setLoading(false);
    });

    return () => {
      unsubDoc();
      unsubChats();
    };
  }, [selectedBusiness]);

  // Merge and sort messages
  const messages = useMemo(() => {
    const merged = [...docArrayMsgs, ...chatDocsMsgs];
    merged.sort((a, b) => {
      const ta = a.ts ? a.ts.getTime() : 0;
      const tb = b.ts ? b.ts.getTime() : 0;
      return ta - tb;
    });
    return merged;
  }, [docArrayMsgs, chatDocsMsgs]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Flex p={4} direction={{ base: "column", md: "row" }} height="100vh">
      
      {/* Sidebar for business selection */}
      <VStack
        spacing={4}
        p={4}
        borderRightWidth={{ md: "1px" }}
        width={{ base: "100%", md: "250px" }}
      >
        <Text fontSize="lg" fontWeight="bold">
          Businesses
        </Text>
        <Select
          value={selectedBusiness}
          onChange={(e) => setSelectedBusiness(e.target.value)}
        >
          {businessIds.map((id) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </Select>
      </VStack>

      {/* Chat window */}
      <Flex direction="column" flex="1" ml={{ md: 4 }} p={4} bg="gray.50" borderRadius="md">
        <Box flex="1" overflowY="auto" mb={4} ref={scrollRef}>
          {loading ? (
            <VStack spacing={3} align="stretch">
              <Skeleton height="20px" />
              <Skeleton height="20px" />
              <Skeleton height="20px" />
            </VStack>
          ) : messages.length === 0 ? (
            <Text color="gray.500">No messages yet for this business.</Text>
          ) : (
            <VStack spacing={3} align="stretch">
              {messages.map((m) => (
                <Box
                  key={`${m.source}-${m.id}`}
                  bg={m.role === "user" ? "blue.100" : "white"}
                  alignSelf={m.role === "user" ? "flex-end" : "flex-start"}
                  p={3}
                  borderRadius="md"
                  shadow="sm"
                  maxW="70%"
                >
                  <Text fontSize="sm" color="gray.500">
                    {m.role} · {m.ts ? m.ts.toLocaleTimeString() : m.fallbackTime}
                  </Text>
                  <Text>{m.content}</Text>
                </Box>
              ))}
            </VStack>
          )}
        </Box>

        <Divider mb={2} />

        {/* Input box */}
        <HStack>
          <Input
            placeholder="Type your message..."
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                toast({ title: "Message sending not implemented yet", status: "info" });
              }
            }}
          />
          <Button
            colorScheme="blue"
            onClick={() => toast({ title: "Message sending not implemented yet", status: "info" })}
          >
            Send
          </Button>
        </HStack>
      </Flex>
    </Flex>
  );
}
