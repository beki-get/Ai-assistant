'use client'

import { Tooltip as ChakraTooltip, Portal } from '@chakra-ui/react'
import * as React from 'react'

export const Tooltip = React.forwardRef(function Tooltip(props, ref) {
  const {
    children,
    disabled = false,
    content,
    showArrow = true,
    portalled = true,
    portalProps,
    ...rest
  } = props

  if (disabled) return children

  return (
    <ChakraTooltip
      label={content}
      hasArrow={showArrow}
      isDisabled={disabled}
      {...rest}
      {...(portalled ? { portalProps } : {})}
      ref={ref}
    >
      {children}
    </ChakraTooltip>
  )
})
