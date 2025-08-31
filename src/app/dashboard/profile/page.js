'use client'

import * as React from 'react'
import {
  Box,
  Heading,
  Text,
  Avatar,
  Button,
  VStack,
  HStack,
  Divider,
  useToast,
} from '@chakra-ui/react'
import { Tooltip } from '@/components/ui/tooltip'
import { ColorModeButton } from '@/components/ui/color-mode'
import { Toaster, useCustomToast } from '@/components/ui/toaster'

export default function ProfilePage() {
  const toast = useCustomToast()

  const handleUpdate = () => {
    toaster.push({
      title: 'Profile Updated',
      description: 'Your profile has been successfully updated!',
      status: 'success',
      duration: 4000,
    })
  }

  return (
    <Box p={6} maxW="3xl" mx="auto">
      {/* Page Header */}
      <HStack justify="space-between" mb={6}>
        <Heading size="lg">My Profile</Heading>
        <ColorModeButton />
      </HStack>

      <Divider mb={6} />

      {/* Profile Info */}
      <VStack spacing={6} align="start">
        <HStack spacing={4}>
          <Avatar name="Bereket Ayele" size="xl" />
          <VStack align="start" spacing={1}>
            <Text fontSize="xl" fontWeight="bold">
              Bereket Ayele
            </Text>
            <Text color="gray.500">bereket@example.com</Text>
          </VStack>
        </HStack>

        {/* Action Buttons */}
        <HStack spacing={4}>
          <Tooltip content="Edit your profile info">
            <Button colorScheme="blue" onClick={handleUpdate}>
              Update Profile
            </Button>
          </Tooltip>
          <Tooltip content="Log out of your account">
            <Button colorScheme="red" variant="outline">
              Logout
            </Button>
          </Tooltip>
        </HStack>
      </VStack>

      {/* Toaster */}
      <Toaster />
    </Box>
  )
}
