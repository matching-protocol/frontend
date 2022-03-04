import React from 'react'
import { ButtonBase, useTheme } from '@mui/material'
import { SxProps } from '@mui/system'

interface Props {
  onClick?: (() => void) | null
  primary?: boolean
  children: React.ReactNode
  width?: string | number
  height?: string | number
  fontSize?: string | number
  disabled?: boolean
  color?: string
  borderRadius?: string
  style?: React.CSSProperties & SxProps
}

export default function OutlineButton(props: Props) {
  const { onClick, disabled, style, width, fontSize, color, primary, height, borderRadius, children } = props
  const theme = useTheme()

  return (
    <ButtonBase
      onClick={onClick ?? undefined}
      disabled={disabled}
      sx={{
        width: width || '100%',
        border: theme =>
          `1px solid ${color ? color : primary ? theme.palette.primary.main : theme.palette.text.secondary}`,
        fontSize,
        fontWeight: 400,
        height: height || 60,
        color: primary ? theme.palette.primary.main : theme.palette.text.primary,
        borderRadius: borderRadius ?? 1.6,
        '&:hover': {
          color: primary ? theme.palette.primary.contrastText : theme.palette.text.primary,
          borderColor: primary ? theme.palette.primary.dark : theme.palette.primary.main,
          background: theme.palette.primary.main
        },
        '&:disabled': {
          opacity: theme.palette.action.disabledOpacity
        },
        ...style
      }}
    >
      {children}
    </ButtonBase>
  )
}
