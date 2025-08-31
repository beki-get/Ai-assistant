'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { updateEmail, updatePassword } from 'firebase/auth'
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  HStack,
  useToast,
  Spinner,
  Text,
} from '@chakra-ui/react'

export default function SettingsPage() {
  const { user } = useAuth()
  const [email, setEmail] = useState(user?.email || '')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const toast = useToast()

  const handleUpdateEmail = async () => {
    if (!email) {
      toast({ title: 'Email is required', status: 'error', duration: 3000, isClosable: true })
      return
    }
    setLoading(true)
    try {
      await updateEmail(user, email)
      toast({ title: 'Email updated successfully!', status: 'success', duration: 3000, isClosable: true })
    } catch (err) {
      toast({ title: err.message || 'Failed to update email', status: 'error', duration: 3000, isClosable: true })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePassword = async () => {
    if (!password) {
      toast({ title: 'Password is required', status: 'error', duration: 3000, isClosable: true })
      return
    }
    setLoading(true)
    try {
      await updatePassword(user, password)
      toast({ title: 'Password updated successfully!', status: 'success', duration: 3000, isClosable: true })
      setPassword('')
    } catch (err) {
      toast({ title: err.message || 'Failed to update password', status: 'error', duration: 3000, isClosable: true })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box maxW="2xl" mx="auto" mt="12" p={{ base: 4, md: 8 }} borderWidth="1px" borderRadius="lg" boxShadow="lg">
      <Heading mb="8" textAlign="center" size="xl" color="blue.600">
        Account Settings
      </Heading>
      <VStack spacing="8" align="stretch">

        {/* Current Email */}
        <FormControl>
          <FormLabel>Current Email</FormLabel>
          <Input value={user?.email || ''} isReadOnly bg="gray.100" />
        </FormControl>

        {/* Update Email */}
        <FormControl>
          <FormLabel>Update Email</FormLabel>
          <HStack spacing="4" flexDirection={{ base: 'column', md: 'row' }}>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} flex="1" />
            <Button
              colorScheme="blue"
              onClick={handleUpdateEmail}
              disabled={loading}
              w={{ base: 'full', md: 'auto' }}
              _hover={{ bg: 'blue.700' }}
            >
              {loading ? <Spinner size="sm" /> : 'Update Email'}
            </Button>
          </HStack>
        </FormControl>

        {/* Update Password */}
        <FormControl>
          <FormLabel>Update Password</FormLabel>
          <HStack spacing="4" flexDirection={{ base: 'column', md: 'row' }}>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} flex="1" />
            <Button
              colorScheme="blue"
              onClick={handleUpdatePassword}
              disabled={loading}
              w={{ base: 'full', md: 'auto' }}
              _hover={{ bg: 'blue.700' }}
            >
              {loading ? <Spinner size="sm" /> : 'Update Password'}
            </Button>
          </HStack>
        </FormControl>

        {/* Info Text */}
        <Text fontSize="sm" color="gray.500">
          Make sure to use a strong password for better security. Email changes will reflect in your login credentials.
        </Text>
      </VStack>
    </Box>
  )
}
