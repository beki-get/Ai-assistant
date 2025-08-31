'use client'

import { useToast as chakraUseToast, Toast, Portal, Spinner, Stack } from '@chakra-ui/react'
import * as React from 'react'

// Optional: a custom hook wrapper
export const useCustomToast = () => {
  return chakraUseToast()
}

// Toaster component
export const Toaster = () => {
  const toast = chakraUseToast()
  return (
    <Portal>
      <Stack spacing={3}>
        {/* Example: you can trigger toast programmatically */}
      </Stack>
    </Portal>
  )
}

  

