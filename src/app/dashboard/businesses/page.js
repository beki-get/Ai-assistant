// src/app/dashboard/businesses/page.js
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Box,
  Heading,
  Input,
  Button,
  VStack,
  HStack,
  Text,
  Link,
} from "@chakra-ui/react";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function BusinessesPage() {
  const { user } = useAuth();
  const [businessName, setBusinessName] = useState("");
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Fetch businesses from Firestore
  useEffect(() => {
    const fetchBusinesses = async () => {
      setLoading(true);
      const snapshot = await getDocs(collection(db, "businesses"));
      setBusinesses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };
    fetchBusinesses();
  }, []);

  // Add a new business
  const handleAddBusiness = async () => {
    if (!businessName.trim()) {
      setMessage("⚠️ Please enter a business name!");
      return;
    }
    setLoading(true);

    const newBusiness = {
      name: businessName,
      owner: user.uid,
      description: "",
      contact: {
        email: "",
        phone: "",
        map: ""
      },
      hours: "",
      faqs: [],
      products: [],
      theme: {
        logoURL: "",
        primaryColor: "#FFFFFF"
      },
      notes: []
    };

    const docRef = await addDoc(collection(db, "businesses"), newBusiness);
    setBusinesses(prev => [...prev, { id: docRef.id, ...newBusiness }]);
    setBusinessName("");
    setMessage("🏢 Business added successfully!");
    setLoading(false);
  };

  // Delete business
  const handleDeleteBusiness = async (id) => {
    await deleteDoc(doc(db, "businesses", id));
    setBusinesses(prev => prev.filter(b => b.id !== id));
    setMessage("🗑️ Business deleted!");
  };

  return (
    <Box p={8} bgGradient="linear(to-r, teal.50, purple.50)" minH="100vh">
      <Heading mb={6}>Businesses Dashboard</Heading>

      {message && (
        <Box mb={6} p={4} bg="blue.100" borderRadius="md">
          {message}
        </Box>
      )}

      <VStack spacing={4} mb={8} align="stretch">
        <Input
          placeholder="Enter business name"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
        />
        <Button
          colorScheme="purple"
          onClick={handleAddBusiness}
          isLoading={loading}
        >
          Add Business
        </Button>
      </VStack>

      <VStack spacing={4} align="stretch">
        {loading ? (
          <Text>Loading businesses...</Text>
        ) : businesses.length === 0 ? (
          <Text>No businesses added yet.</Text>
        ) : (
          businesses.map((b) => (
            <Box
              key={b.id}
              p={4}
              shadow="md"
              borderRadius="md"
              _hover={{ transform: "scale(1.02)", shadow: "lg" }}
              transition="all 0.2s"
            >
              <Link href={`/dashboard/businesses/${b.id}`}>
                <Text>🏢 {b.name}</Text>
              </Link>
              <HStack spacing={2} mt={2}>
                <Button
                  size="sm"
                  colorScheme="blue"
                  variant="outline"
                  onClick={() => window.location.href = `/dashboard/businesses/${b.id}`}
                >
                  ✏️ Edit
                </Button>
                <Button
                  size="sm"
                  colorScheme="red"
                  variant="outline"
                  onClick={() => handleDeleteBusiness(b.id)}
                >
                  🗑️ Delete
                </Button>
              </HStack>
            </Box>
          ))
        )}
      </VStack>
    </Box>
  );
}
