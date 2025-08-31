// src/app/dashboard/orders/page.js
"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { Box, Heading, VStack, Text, Button, Spinner } from "@chakra-ui/react";

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const q = query(collection(db, "orders"), where("businessId", "==", user.uid));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    try {
      await deleteDoc(doc(db, "orders", id));
      setOrders(prev => prev.filter(o => o.id !== id));
    } catch (err) {
      console.error("Error deleting order:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  if (loading) return <Spinner size="xl" />;

  return (
    <Box p={6}>
      <Heading mb={4}>Orders</Heading>
      {orders.length === 0 ? (
        <Text>No orders found.</Text>
      ) : (
        <VStack spacing={4} align="stretch">
          {orders.map(o => (
            <Box key={o.id} p={4} borderWidth="1px" borderRadius="lg">
              <Text><strong>Customer:</strong> {o.customerName}</Text>
              <Text><strong>Email:</strong> {o.customerEmail}</Text>
              <Text><strong>Item:</strong> {o.item}</Text>
              <Text><strong>Quantity:</strong> {o.quantity}</Text>
              <Text><strong>Status:</strong> {o.status}</Text>
              <Button mt={2} colorScheme="red" onClick={() => handleDelete(o.id)}>Delete</Button>
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
}
