// src/app/dashboard/page.js
"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Box, SimpleGrid, Heading, Text } from "@chakra-ui/react";
import BookingsTable from "@/components/BookingsTable"; // optional if you have bookings table
import OrdersTable from "@/components/OrdersTable"; // optional if you have orders table

export default function DashboardPage() {
  const [stats, setStats] = useState({
    messages: 0,
    bookings: 0,
    orders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const msgsSnapshot = await getDocs(collection(db, "messages"));
        const bookingsSnapshot = await getDocs(collection(db, "bookings"));
        const ordersSnapshot = await getDocs(collection(db, "orders"));

        setStats({
          messages: msgsSnapshot.size,
          bookings: bookingsSnapshot.size,
          orders: ordersSnapshot.size,
        });
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return <Text>Loading dashboard...</Text>;

  return (
    <Box p={5}>
      <Heading mb={5}>Dashboard Overview</Heading>

      <SimpleGrid columns={[1, 2, 3]} spacing={5} mb={10}>
        <Box p={5} borderRadius="md" bg="blue.50">
          <Text fontSize="xl" fontWeight="bold">{stats.messages}</Text>
          <Text>Messages</Text>
        </Box>
        <Box p={5} borderRadius="md" bg="green.50">
          <Text fontSize="xl" fontWeight="bold">{stats.bookings}</Text>
          <Text>Bookings</Text>
        </Box>
        <Box p={5} borderRadius="md" bg="orange.50">
          <Text fontSize="xl" fontWeight="bold">{stats.orders}</Text>
          <Text>Orders</Text>
        </Box>
      </SimpleGrid>

      <Box mb={10}>
        <Heading size="md" mb={3}>Bookings</Heading>
        <BookingsTable />
      </Box>

      <Box>
        <Heading size="md" mb={3}>Orders</Heading>
        <OrdersTable />
      </Box>
    </Box>
  );
}
