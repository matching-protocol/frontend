import { Box, Typography } from '@mui/material'

export default function StatusTag({
  type,
  width,
  height,
  fontSize
}: {
  type: 'pending' | 'complete'
  width?: string | number
  height?: string | number
  fontSize?: string | number
}) {
  return (
    <Box
      borderRadius={10}
      width={width || 72}
      height={height || 28}
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor={type === 'pending' ? 'rgba(38, 99, 255, 0.16)' : 'rgba(17, 191, 45, 0.12)'}
    >
      <Typography
        fontSize={fontSize || 12}
        color={type === 'pending' ? 'rgba(38, 99, 255, 1)' : 'rgba(17, 191, 45, 1)'}
      >
        {type === 'pending' ? 'Pending' : 'Complete'}
      </Typography>
    </Box>
  )
}
