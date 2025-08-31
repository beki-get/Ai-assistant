// src/app/dashboard/bookings/page.js
"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { Box, Heading, VStack, Text, Button, Spinner } from "@chakra-ui/react";

export default function BookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const q = query(collection(db, "bookings"), where("businessId", "==", user.uid));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBookings(data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;
    try {
      await deleteDoc(doc(db, "bookings", id));
      setBookings(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      console.error("Error deleting booking:", err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  if (loading) return <Spinner size="xl" />;

  return (
    <Box p={6}>
      <Heading mb={4}>Bookings</Heading>
      {bookings.length === 0 ? (
        <Text>No bookings found.</Text>
      ) : (
        <VStack spacing={4} align="stretch">
          {bookings.map(b => (
            <Box key={b.id} p={4} borderWidth="1px" borderRadius="lg">
              <Text><strong>Name:</strong> {b.customerName}</Text>
              <Text><strong>Email:</strong> {b.customerEmail}</Text>
              <Text><strong>Date:</strong> {b.date}</Text>
              <Text><strong>Time:</strong> {b.time}</Text>
              <Button mt={2} colorScheme="red" onClick={() => handleDelete(b.id)}>Delete</Button>
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
}
