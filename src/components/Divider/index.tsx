import { Divider as MuiDivider, DividerProps } from '@mui/material'

interface Props {
  orientation?: 'horizontal' | 'vertical'
  //extension must be in px
  extension?: number
}

export default function Divider({ extension, orientation, ...props }: Props & DividerProps) {
  return (
    <MuiDivider
      {...props}
      sx={{
        width: extension ? `calc(100% + ${extension * 2}px)` : orientation === 'vertical' ? 1 : '100%',
        border: 'none',
        height: orientation === 'vertical' ? '100%' : '1px',
        backgroundColor: '#F3F3F3',
        margin: extension ? `0 -${extension}px` : '0'
      }}
    />
  )
}
