import React from 'react'
import { ButtonBase, useTheme } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

interface Props {
  onClick?: () => void
  width?: string
  height?: string
  children?: React.ReactNode
  primary?: boolean
  disabled?: boolean
  hideArrow?: boolean

  style?: React.CSSProperties
}

export default function SelectButton(props: Props) {
  const { onClick, disabled, style, width, height, children, hideArrow } = props
  const theme = useTheme()

  return (
    <ButtonBase
      onClick={onClick}
      disabled={disabled}
      sx={{
        width: width || '100%',
        height: height || 60,
        backgroundColor: '#F7F7F8',
        color: theme.palette.text.primary,
        borderRadius: 1,
        transition: '.3s',
        border: '1px solid transparent',
        display: 'flex',
        gap: 12,
        ...style
      }}
    >
      {children}
      {!hideArrow && <ExpandMoreIcon />}
    </ButtonBase>
  )
}
