"use client";
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ChatBox from "@/components/ChatBox";
import ChatViewer from "@/components/ChatViewer";
import {
  Box,
  Flex,
  VStack,
  Text,
  Heading,
  Skeleton,
  Divider,
} from "@chakra-ui/react";

export default function ChatPage() {
  const searchParams = useSearchParams();
  const businessId = searchParams.get("businessId");

  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (!businessId) return;
    const fetchBusiness = async () => {
      try {
        const chatsCollection = collection(db, "messages", businessId, "chats");
        const q = query(chatsCollection, limit(1));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const firstDoc = snapshot.docs[0].data();
          setBusiness({
            id: businessId,
            name: firstDoc.businessName || "Business Chat",
            description: firstDoc.businessDescription || "Welcome to our chat!",
          });
        } else {
          setBusiness({
            id: businessId,
            name: "Business Chat",
            description: "No messages yet, start chatting!",
          });
        }
      } catch (err) {
        console.error("Error fetching business:", err);
        setBusiness({ id: businessId, name: "Business Chat", description: "" });
      } finally {
        setLoading(false);
      }
    };
    fetchBusiness();
  }, [businessId]);

  // Scroll to bottom on new messages
  const scrollToBottom = () => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  if (!businessId) return <Text>No business selected.</Text>;
  if (loading) return <Skeleton height="20px" w="full" />;

  return (
    <Flex direction="column" h="100vh" maxW="800px" mx="auto" p={4}>
      {/* Header */}
      <Box mb={4} p={3} bg="blue.600" color="white" borderRadius="md" shadow="md">
        <Heading size="md">{business.name}</Heading>
        <Text fontSize="sm">{business.description}</Text>
      </Box>

      {/* Chat messages */}
      <Box
        flex="1"
        bg="gray.50"
        p={4}
        borderRadius="md"
        overflowY="auto"
        shadow="sm"
        mb={4}
      >
        <ChatViewer businessId={business.id} scrollToBottom={scrollToBottom}>
          <VStack spacing={3} align="stretch">
            {/* Chat messages will render inside ChatViewer */}
          </VStack>
        </ChatViewer>
        <div ref={chatEndRef} />
      </Box>

      <Divider mb={3} />

      {/* Chat input */}
      <Box>
        <ChatBox businessId={business.id} onSend={scrollToBottom} />
      </Box>
    </Flex>
  );
}
