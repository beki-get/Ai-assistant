"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  Box,
  VStack,
  Heading,
  Input,
  Button,
  Text,
  HStack,
  Icon,
  Link as ChakraLink
} from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import NextLink from "next/link";

export default function SignupPage() {
  const { signup, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async () => {
    setError("");
    if (!email || !password) return setError("Email and password are required.");
    if (!/\S+@\S+\.\S+/.test(email)) return setError("Please enter a valid email address.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirmPassword) return setError("Passwords do not match.");

    setLoading(true);
    try {
      await signup(email, password, displayName || null);
      router.push("/dashboard/");
    } catch (err) {
      setError(err.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithGoogle();
      router.push("/dashboard/");
    } catch (err) {
      setError(err.message || "Google signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      maxW={{ base: "90%", md: "400px" }}
      mx="auto"
      mt={{ base: "8", md: "16" }}
      p={{ base: "6", md: "8" }}
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="xl"
      bg="white"
    >
      <Heading mb="6" textAlign="center" fontSize={{ base: "2xl", md: "3xl" }}>
        Create Your Account
      </Heading>

      {error && (
        <Text color="red.500" mb="4" textAlign="center">
          {error}
        </Text>
      )}

      <VStack spacing="4">
        <Input
          placeholder="Display Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          focusBorderColor="blue.400"
          _hover={{ borderColor: "blue.300" }}
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          focusBorderColor="blue.400"
          _hover={{ borderColor: "blue.300" }}
        />
        <Input
          type="password"
          placeholder="Password (min 6 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          focusBorderColor="blue.400"
          _hover={{ borderColor: "blue.300" }}
        />
        <Input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          focusBorderColor="blue.400"
          _hover={{ borderColor: "blue.300" }}
        />
        <Button
          colorScheme="blue"
          w="full"
          onClick={handleSignup}
          isLoading={loading}
          _hover={{ bg: "blue.600" }}
        >
          Sign Up
        </Button>
      </VStack>

      {/* Divider */}
      <HStack my="6" align="center">
        <Box flex="1" height="1px" bg="gray.300" />
        <Text fontSize="sm" color="gray.500" mx="2">or</Text>
        <Box flex="1" height="1px" bg="gray.300" />
      </HStack>

      {/* Google Signup */}
      <Button
        w="full"
        variant="outline"
        leftIcon={<Icon as={FcGoogle} w={6} h={6} />}
        onClick={handleGoogleSignup}
        isLoading={loading}
        _hover={{ bg: "gray.100" }}
      >
        Sign up with Google
      </Button>

      {/* Already have account */}
      <Text textAlign="center" mt={6} fontSize="sm">
        Already have an account?{" "}
        <ChakraLink as={NextLink} href="/login" color="blue.500" fontWeight="semibold">
          Sign In
        </ChakraLink>
      </Text>
    </Box>
  );
}
