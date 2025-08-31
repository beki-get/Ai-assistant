"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  Box,
  VStack,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Text,
  HStack,
  Icon,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";
import NextLink from "next/link";

const MotionBox = motion(Box);

export default function LoginPage() {
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setError("");
    if (!email || !password) return setError("Email and password are required.");
    if (!/\S+@\S+\.\S+/.test(email)) return setError("Please enter a valid email address.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");

    setLoading(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    try {
      await loginWithGoogle();
      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      minH="100vh"
      position="relative"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgImage="url('/login-bg.jpg')"
      bgSize="cover"
      bgPos="center"
      p={{ base: 4, md: 0 }}
    >
      {/* Background overlay for readability */}
      <Box position="absolute" inset="0" bg="blackAlpha.500" />

      <MotionBox
        maxW={{ base: "90%", md: "400px" }}
        p={{ base: 6, md: 8 }}
        borderWidth="1px"
        borderRadius="lg"
        boxShadow="2xl"
        bg="white"
        position="relative"
        zIndex="1"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Heading mb="6" textAlign="center" fontSize={{ base: "2xl", md: "3xl" }}>
          Welcome Back
        </Heading>

        {error && (
          <Text color="red.500" mb="4" textAlign="center">
            {error}
          </Text>
        )}

        <VStack spacing="4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            focusBorderColor="blue.400"
            _hover={{ borderColor: "blue.300" }}
            _focus={{ transform: "scale(1.02)", transition: "0.2s" }}
          />

          <InputGroup>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              focusBorderColor="blue.400"
              _hover={{ borderColor: "blue.300" }}
              _focus={{ transform: "scale(1.02)", transition: "0.2s" }}
            />
            <InputRightElement>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <ViewOffIcon /> : <ViewIcon />}
              </Button>
            </InputRightElement>
          </InputGroup>

          {/* Gradient Login Button */}
          <Button
            w="full"
            bgGradient="linear(to-r, blue.400, purple.500)"
            color="white"
            _hover={{ bgGradient: "linear(to-r, blue.500, purple.600)", transform: "scale(1.05)" }}
            _active={{ transform: "scale(0.98)" }}
            onClick={handleLogin}
            isLoading={loading}
          >
            Login
          </Button>

          {/* Divider with "or" */}
          <HStack my="4" align="center">
            <Box flex="1" height="1px" bg="gray.300" />
            <Text fontSize="sm" color="gray.500" mx="2">
              or
            </Text>
            <Box flex="1" height="1px" bg="gray.300" />
          </HStack>

          {/* Google Login */}
          <Button
            w="full"
            variant="outline"
            leftIcon={<Icon as={FcGoogle} w={6} h={6} />}
            onClick={handleGoogle}
            isLoading={loading}
            _hover={{ bg: "gray.100" }}
          >
            Continue with Google
          </Button>

          {/* Forgot Password */}
          <Text fontSize="sm" mt="2" textAlign="center">
            <ChakraLink as={NextLink} href="/reset-password" color="blue.500" fontWeight="semibold">
              Forgot Password?
            </ChakraLink>
          </Text>

          {/* Don't have an account */}
          <Text fontSize="sm" mt="2" textAlign="center">
            Don’t have an account?{" "}
            <ChakraLink as={NextLink} href="/signup" color="purple.500" fontWeight="semibold">
              Sign Up
            </ChakraLink>
          </Text>
        </VStack>
      </MotionBox>
    </Box>
  );
}
