'use client'

import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { ColorModeProvider } from './color-mode'

// Optional: customize your Chakra theme
const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
})

export function Provider({ children }) {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeProvider>{children}</ColorModeProvider>
    </ChakraProvider>
  )
}
