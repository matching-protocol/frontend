import { Typography, Box } from '@mui/material'

export default function ComposedText({
  text,
  subText,
  textSize,
  textWeight,
  subTextSize,
  subTextWeight,
  textOpacity,
  subTextOpacity
}: {
  text: string
  subText: string
  textSize?: string | number
  subTextSize?: string | number
  textWeight?: number
  subTextWeight?: number
  textOpacity?: number
  subTextOpacity?: number
}) {
  return (
    <Box display="flex" alignItems="flex-end">
      <Typography fontSize={textSize || 16} fontWeight={textWeight || 500} sx={{ opacity: textOpacity || 0.5 }}>
        {text}
      </Typography>
      <Typography
        fontSize={subTextSize || 11}
        fontWeight={subTextWeight || 400}
        sx={{ opacity: subTextOpacity || 0.5 }}
        component="span"
      >
        {subText}
      </Typography>
    </Box>
  )
}
