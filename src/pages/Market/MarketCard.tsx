import Card from 'components/Card'
import { Box, Typography } from '@mui/material'
import { MarketTableHeaderIndex } from './'

export default function MarketCard({ row, header }: { row: any; header: string[] }) {
  return (
    <Card width="100%">
      <Box width="100%" display="flex" flexDirection="column" gap="24px" padding="20px 24px 32px">
        <Box display="flex" justifyContent="space-between" alignItems={'center'}>
          {row[MarketTableHeaderIndex.orderId]}
          {row[MarketTableHeaderIndex.action]}
        </Box>
        {header.slice(1, -1).map((headerString, index) => (
          <Box key={index}>
            <Typography fontSize={12} fontWeight={500} sx={{ opacity: 0.5 }}>
              {headerString}:
            </Typography>
            <Box
              mt={10}
              bgcolor="#F7F7F8"
              borderRadius="16px"
              pl={20}
              pr={20}
              display="flex"
              alignItems="center"
              height={52}
            >
              {row[index + 1] ?? null}
            </Box>
          </Box>
        ))}
      </Box>
    </Card>
  )
}
