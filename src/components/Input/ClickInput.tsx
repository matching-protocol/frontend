import { InputHTMLAttributes, useEffect, useState } from 'react'
import { Box, InputBase, Typography } from '@mui/material'
import { inputBaseClasses } from '@mui/material/InputBase'
import InputLabel from './InputLabel'
import theme from 'theme'
import { InputProps } from './index'

export default function ClickInput({
  focused,
  placeholder,
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
  // smallPlaceholder,
  subStr,
  backgroundColor,
  fontSize,
  rightLabel,
  onValue,
  ...rest
}: InputProps &
  Omit<InputHTMLAttributes<HTMLInputElement> & { onValue?: (val: string) => void }, 'color' | 'outline' | 'size'>) {
  const [showInput, setShowInput] = useState(false)
  const [inputValue, setInputValue] = useState(value)

  useEffect(() => {
    if (!showInput) {
      setInputValue(value)
    }
    return () => {}
  }, [value, showInput])

  return (
    <div style={{ width: '100%', maxWidth: maxWidth || 'unset' }}>
      <Box display={'flex'} justifyContent="space-between">
        {label ? <InputLabel>{label}</InputLabel> : ''}
        {rightLabel ? <InputLabel style={{ marginRight: 10 }}>{rightLabel}</InputLabel> : ''}
      </Box>
      {!showInput && !disabled ? (
        <Box
          onClick={() => setShowInput(true)}
          sx={{
            height: height || 60,
            display: 'flex',
            alignItems: 'center',
            backgroundColor: backgroundColor || theme.palette.background.paper,
            paddingLeft: 20,
            borderRadius: '16px',
            fontSize: fontSize || 16
          }}
          color={error ? 'error' : 'primary'}
          {...rest}
        >
          {value || '0.00'}
        </Box>
      ) : (
        <InputBase
          autoFocus
          sx={{
            height: height || 60,
            backgroundColor: backgroundColor || theme.palette.background.paper,
            paddingLeft: 20,
            borderRadius: '16px',
            fontSize: fontSize || 16,
            [`&.${inputBaseClasses.root}`]: {
              border: theme => `1px solid ${outlined ? '#D9D9DA' : error ? theme.palette.error.main : 'transparent'}`
            },
            [`&.${inputBaseClasses.focused}`]: {
              borderColor: theme =>
                error ? `${theme.palette.error.main}!important` : `${theme.palette.primary.main}!important`
            },
            [`& .${inputBaseClasses.input}`]: {
              '&::placeholder': {
                fontSize: fontSize || 16,
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
          onChange={e => setInputValue(e.target.value)}
          onBlur={e => {
            onValue && onValue(e.target.value)
            setShowInput(false)
          }}
          value={inputValue}
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
      )}
      {subStr && (
        <Typography fontSize={12} mt={12} sx={{ opacity: 0.5 }}>
          {subStr}
        </Typography>
      )}
    </div>
  )
}
