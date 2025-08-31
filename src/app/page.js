'use client';
import Link from "next/link";
import { FaBoxOpen, FaCalendarCheck, FaRocket } from "react-icons/fa";
import { Box, Flex, Heading, Text, Button, VStack, SimpleGrid } from "@chakra-ui/react";
import { motion } from "framer-motion";

// Motion wrapper for animations
const MotionBox = motion(Box);

export default function Home() {
  return (
    <Box minH="100vh" bgGradient="linear(to-r, blue.100, white, green.100)" display="flex" flexDirection="column">

      {/* Navigation */}
      <Flex as="nav" w="full" bg="white" shadow="md" py={4} px={6} justify="space-between" align="center" position="sticky" top="0" zIndex="50">
        <Heading color="red.500" size="xl">
          Smart Desk <Text as="span" color="gray.600" fontSize="lg">– Smart Business Manager</Text>
        </Heading>
        <Flex gap={4}>
          <Link href="/signup"><Button colorScheme="purple">Sign Up</Button></Link>
          <Link href="/login"><Button variant="outline" colorScheme="blue">Login</Button></Link>
        </Flex>
      </Flex>

      {/* Hero Section */}
      <MotionBox
        flex="1"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        textAlign="center"
        px={6}
        py={16}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Heading size="2xl" mb={4}>Manage Orders & Bookings Effortlessly</Heading>
        <Text mb={6} maxW="xl">
          Keep track of your orders and bookings in one modern, easy-to-use dashboard with responsive and interactive UI.
        </Text>
        <Flex gap={4} wrap="wrap">
          <Link href="/signup"><Button colorScheme="purple" px={6} py={3}>Get Started</Button></Link>
          <Link href="/login"><Button variant="outline" colorScheme="blue" px={6} py={3}>Sign In</Button></Link>
        </Flex>
      </MotionBox>

      {/* Features Section */}
      <Box py={16} px={6} bg="white">
        <Heading size="xl" textAlign="center" mb={12}>Why Choose AI Assistant?</Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={8} maxW="6xl" mx="auto">
          
          <MotionBox
            p={6} bg="blue.50" rounded="lg" shadow="md"
            whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.2)" }}
            transition={{ duration: 0.3 }}
          >
            <VStack spacing={4}>
              <FaBoxOpen color="#3182ce" size={48} />
              <Heading size="md">Orders Management</Heading>
              <Text textAlign="center">Easily create, update, and track all your orders in one place.</Text>
            </VStack>
          </MotionBox>

          <MotionBox
            p={6} bg="green.50" rounded="lg" shadow="md"
            whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.2)" }}
            transition={{ duration: 0.3 }}
          >
            <VStack spacing={4}>
              <FaCalendarCheck color="#38a169" size={48} />
              <Heading size="md">Bookings Management</Heading>
              <Text textAlign="center">Schedule, update, and cancel bookings efficiently with a single dashboard.</Text>
            </VStack>
          </MotionBox>

          <MotionBox
            p={6} bg="yellow.100" rounded="lg" shadow="md"
            whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.2)" }}
            transition={{ duration: 0.3 }}
          >
            <VStack spacing={4}>
              <FaRocket color="#b7791f" size={48} />
              <Heading size="md">Fast & Responsive</Heading>
              <Text textAlign="center">Fully responsive design that works smoothly on mobile, tablet, and desktop.</Text>
            </VStack>
          </MotionBox>

        </SimpleGrid>
      </Box>

      {/* Call to Action */}
      <MotionBox
        py={16}
        px={6}
        bgGradient="linear(to-r, blue.200, green.200)"
        textAlign="center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Heading size="xl" mb={4}>Start managing today!</Heading>
        <Text mb={6} maxW="lg" mx="auto">
          Sign up and start creating orders and bookings immediately with our interactive dashboard.
        </Text>
        <Flex gap={4} justify="center" wrap="wrap">
          <Link href="/signup"><Button colorScheme="purple" px={6} py={3}>Get Started</Button></Link>
          <Link href="/login"><Button colorScheme="blue" variant="outline" px={6} py={3}>Sign In</Button></Link>
        </Flex>
      </MotionBox>

      {/* Footer */}
      <Box bg="white" shadow="inner" py={6} mt="auto" textAlign="center" color="gray.500">
        © 2025 AI Assistant. All rights reserved. | <Link href="/terms">Terms</Link> · <Link href="/privacy">Privacy</Link> · <Link href="/support">Support</Link>
      </Box>
    </Box>
  );
}
