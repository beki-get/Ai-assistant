"use client";

import { IconButton, Skeleton } from '@chakra-ui/react'
import { ThemeProvider, useTheme } from 'next-themes'
import * as React from 'react'
import { LuMoon, LuSun } from 'react-icons/lu'

// Theme provider wrapper
export function ColorModeProvider(props) {
  return (
    <ThemeProvider attribute='class' disableTransitionOnChange {...props} />
  )
}

// Custom hook for color mode
export function useColorMode() {
  const { resolvedTheme, setTheme, forcedTheme } = useTheme()
  const colorMode = forcedTheme || resolvedTheme
  const toggleColorMode = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }
  return {
    colorMode,
    setColorMode: setTheme,
    toggleColorMode,
  }
}

// Hook for light/dark value
export function useColorModeValue(light, dark) {
  const { colorMode } = useColorMode()
  return colorMode === 'dark' ? dark : light
}

// Icon for current mode
export function ColorModeIcon() {
  const { colorMode } = useColorMode()
  return colorMode === 'dark' ? <LuMoon /> : <LuSun />
}

// Color mode toggle button
export const ColorModeButton = React.forwardRef(function ColorModeButton(props, ref) {
  const { toggleColorMode } = useColorMode()
  const [mounted, setMounted] = React.useState(false)

  // Ensure component only renders on client
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <Skeleton boxSize='8' />

  return (
    <IconButton
      onClick={toggleColorMode}
      variant='ghost'
      aria-label='Toggle color mode'
      size='sm'
      ref={ref}
      {...props}
    >
      <ColorModeIcon />
    </IconButton>
  )
})
