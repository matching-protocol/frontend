import React, { ChangeEvent, InputHTMLAttributes } from 'react'
import { InputBase, styled, Typography } from '@mui/material'
import { inputBaseClasses } from '@mui/material/InputBase'
import InputLabel from './InputLabel'
import theme from 'theme'

export interface InputProps {
  placeholder?: string
  value: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  label?: string
  disabled?: boolean
  focused?: boolean
  outlined?: boolean
  type?: string
  startAdornment?: React.ReactNode
  endAdornment?: React.ReactNode
  maxWidth?: string | number
  height?: string | number
  error?: boolean
  smallPlaceholder?: boolean
  subStr?: string
  backgroundColor?: string
}

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  [`&.${inputBaseClasses.root}`]: {
    fontSize: 16,
    color: theme.palette.text.primary,
    fontFamily: 'SF Pro',
    fontWeight: 400,
    // backgroundColor: theme.palette.background.paper,
    paddingLeft: 20,
    borderRadius: 16
  },
  [`&.${inputBaseClasses.focused}`]: { border: `1px solid ${theme.palette.primary.main} !important` },
  [`& .${inputBaseClasses.input}`]: {
    maxWidth: '100%',
    '&::-webkit-outer-spin-button': {
      WebkitAppearance: 'none'
    },
    '&::-webkit-inner-spin-button': {
      WebkitAppearance: 'none'
    },
    '&.Mui-disabled': {
      WebkitTextFillColor: theme.palette.text.secondary,
      color: theme.palette.text.secondary
    }
  },
  [`&.${inputBaseClasses.disabled}`]: {
    cursor: 'not-allowed'
  }
}))

export default function Input({
  focused,
  placeholder,
  onChange,
  value,
  disabled,
  type,
  outlined,
  startAdornment,
  endAdornment,
  maxWidth,
  label,
  height,
  error,
  smallPlaceholder,
  subStr,
  backgroundColor,
  ...rest
}: InputProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'color' | 'outline' | 'size'>) {
  return (
    <div style={{ width: '100%', maxWidth: maxWidth || 'unset' }}>
      {label && <InputLabel>{label}</InputLabel>}
      <StyledInputBase
        sx={{
          height: height || 60,
          backgroundColor: backgroundColor || theme.palette.background.paper,
          [`&.${inputBaseClasses.root}`]: {
            border: theme => `1px solid ${outlined ? '#D9D9DA' : error ? theme.palette.error.main : 'transparent'}`
          },
          [`&.${inputBaseClasses.focused}`]: {
            borderColor: theme =>
              error ? `${theme.palette.error.main}!important` : `${theme.palette.primary.main}!important`
          },
          [`& .${inputBaseClasses.input}`]: {
            '&::placeholder': {
              fontSize: smallPlaceholder ? 13 : 16,
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden'
            }
          }
        }}
        color={error ? 'error' : 'primary'}
        fullWidth={true}
        placeholder={placeholder}
        inputRef={input => input && focused && input.focus()}
        onChange={onChange}
        value={value}
        disabled={disabled}
        type={type}
        endAdornment={endAdornment && <span style={{ paddingRight: 20 }}>{endAdornment}</span>}
        startAdornment={
          startAdornment && (
            <span style={{ paddingRight: 12, display: 'flex', alignItems: 'center' }}>{startAdornment}</span>
          )
        }
        {...rest}
      />
      {subStr && (
        <Typography fontSize={12} mt={12} sx={{ opacity: 0.5 }}>
          {subStr}
        </Typography>
      )}
    </div>
  )
}
