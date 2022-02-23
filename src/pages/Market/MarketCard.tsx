import Card from 'components/Card'
import { Box, Typography } from '@mui/material'

export default function MarketCard({ row, header }: { row: any; header: string[] }) {
  return (
    <Card width="100%">
      <Box width="100%" display="flex" flexDirection="column" gap="16px">
        {header.map((headerString, index) => (
          <Box key={index}>
            <Typography>{headerString}</Typography>
            <Typography>{row[index] ?? null}</Typography>
          </Box>
        ))}
      </Box>
    </Card>
  )
}
