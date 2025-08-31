//src/app/dashboard/layout.js
"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FiMenu } from "react-icons/fi";

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

export default function DashboardLayout({ children }) {
   const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.900", "white");
  const sidebarBg = useColorModeValue("gray.50", "gray.800");
  const sidebarColor = useColorModeValue("gray.900", "white");

  const { user, logout } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  // Sidebar content reused for desktop + mobile drawer
  const SidebarContent = ({ bgColor, textColor }) => (
    <VStack align="start" spacing={6} h="100%" justify="space-between">
      <Box w="full">
        <Text fontSize="2xl" fontWeight="bold" mb={6}>
          Dashboard
        </Text>
        <VStack align="stretch" spacing={2} w="full">
          {/* Core Pages */}
          <Button as={Link} href="/dashboard" variant="ghost" justifyContent="flex-start">
            Overview
          </Button>
          <Button as={Link} href="/dashboard/businesses" variant="ghost" justifyContent="flex-start">
            Businesses
          </Button>
         
          <Button as={Link} href="/dashboard/messages" variant="ghost" justifyContent="flex-start">
            Messages
          </Button>
          <Button as={Link} href="/dashboard/orders" variant="ghost" justifyContent="flex-start">
            Orders
          </Button>
          <Button as={Link} href="/dashboard/bookings" variant="ghost" justifyContent="flex-start">
            Bookings
          </Button>
          <Button as={Link} href="/dashboard/chats" variant="ghost" justifyContent="flex-start">
            Chats
          </Button>

          {/* Future-proof placeholders */}
          <Button as={Link} href="/dashboard/analytics" variant="ghost" justifyContent="flex-start">
            Analytics
          </Button>
          <Button as={Link} href="/dashboard/reports" variant="ghost" justifyContent="flex-start">
            Reports
          </Button>
          <Button as={Link} href="/dashboard/support" variant="ghost" justifyContent="flex-start">
            Help & Support
          </Button>
        </VStack>
      </Box>

      {/* Profile Section */}
      {user && (
        <Menu>
          <MenuButton
            as={Button}
            w="full"
            justifyContent="flex-start"
            bg={bgColor}
            _hover={{ bg: textColor }}
          >
            <HStack>
              <Avatar size="sm" src={user.photoURL || undefined} name={user.displayName || "User"} />
              <Text>{user.displayName || "User"}</Text>
            </HStack>
          </MenuButton>
          <MenuList>
            <MenuItem as={Link} href="/dashboard/profile">
              Profile
            </MenuItem>
            <MenuItem as={Link} href="/dashboard/settings">
              Settings
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </MenuList>
        </Menu>
      )}
    </VStack>
  );



  return (
    <Flex h="100vh" overflow="hidden">
      {/* Sidebar (desktop) */}
      <Box
           w="64"
        bg={sidebarBg}
        color={sidebarColor}
        p={4}
        display={{ base: "none", md: "flex" }}
        flexDirection="column"
        justifyContent="space-between"
        boxShadow="xl"
        zIndex={10}
      >
        <SidebarContent />
      </Box>

      {/* Mobile Menu Button */}
      <IconButton
        aria-label="Open menu"
        icon={<FiMenu />}
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        position="absolute"
        top="4"
        left="4"
        zIndex={20}
      />

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody>
            <SidebarContent />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Main Content with animated background */}
      <Box flex="1" position="relative" overflow="hidden">
        {/* Animated Background */}
        <MotionBox
          position="absolute"
          inset="0"
          bgGradient="linear(to-br, gray.100, gray.200, gray.100)"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          bgSize="200% 200%"
          zIndex={0}
        />

        {/* Content */}
        <MotionFlex
          position="relative"
          zIndex={1}
          flex="1"
          p={6}
          overflowY="auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {children}
        </MotionFlex>
      </Box>
    </Flex>
  );
}
