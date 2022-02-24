import { Box, Typography } from '@mui/material'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { Currency } from 'constants/token/currency'

export default function CurrencyValue({
  currency,
  value,
  equivalent
}: {
  currency: Currency
  value: string
  equivalent: string
}) {
  return (
    <Box display="flex" alignItems="center" gap={10}>
      <CurrencyLogo size="32px" currency={currency} />
      <Box>
        <Typography fontSize={16} fontWeight={500}>
          {value}
        </Typography>
        <Typography fontSize={13} fontWeight={400} sx={{ opacity: 0.5 }}>
          {equivalent}
        </Typography>
      </Box>
    </Box>
  )
}
