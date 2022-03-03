import React from 'react'
import { InputLabel as MuiInputLabel } from '@mui/material'
import { ReactComponent as InfoIcon } from '../../assets/componentsIcon/info_icon.svg'

export default function InputLabel({
  children,
  infoIcon,
  style
}: {
  children?: React.ReactNode
  infoIcon?: boolean
  style?: React.CSSProperties
}) {
  return (
    <MuiInputLabel
      sx={{
        color: theme => theme.palette.primary.main,
        marginBottom: '8px',
        display: 'flex',
        alignItems: 'center',
        opacity: 0.5,
        fontSize: 14,
        fontWeight: 500,
        ...style
      }}
    >
      {children}
      {infoIcon && (
        <InfoIcon
          style={{
            marginLeft: 4,
            cursor: 'pointer'
          }}
        />
      )}
    </MuiInputLabel>
  )
}
