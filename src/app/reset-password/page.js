"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Box,
  VStack,
  Heading,
  Input,
  Button,
  Text,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email) return setError("Please enter your email.");
    if (!/\S+@\S+\.\S+/.test(email))
      return setError("Please enter a valid email.");

    try {
      setLoading(true);
      await resetPassword(email);
      setMessage("✅ Password reset email sent! Check your inbox.");
    } catch (err) {
      setError(err.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      minH="100vh"
      bg="gray.50"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={{ base: 4, md: 0 }}
    >
      <MotionBox
        maxW="400px"
        w="full"
        p={{ base: 6, md: 8 }}
        borderWidth="1px"
        borderRadius="lg"
        boxShadow="xl"
        bg="white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Heading mb="6" textAlign="center" fontSize={{ base: "2xl", md: "3xl" }}>
          Reset Password
        </Heading>

        {message && (
          <Text color="green.500" mb="4" textAlign="center">
            {message}
          </Text>
        )}
        {error && (
          <Text color="red.500" mb="4" textAlign="center">
            {error}
          </Text>
        )}

        <form onSubmit={handleReset}>
          <VStack spacing="4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              focusBorderColor="blue.400"
              _hover={{ borderColor: "blue.300" }}
              _focus={{ transform: "scale(1.02)", transition: "0.2s" }}
            />

            <Button
              w="full"
              bgGradient="linear(to-r, blue.400, purple.500)"
              color="white"
              _hover={{ bgGradient: "linear(to-r, blue.500, purple.600)", transform: "scale(1.05)" }}
              _active={{ transform: "scale(0.98)" }}
              type="submit"
              isLoading={loading}
            >
              Send Reset Email
            </Button>
          </VStack>
        </form>
      </MotionBox>
    </Box>
  );
}
