import { Box, Typography } from '@mui/material'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { Currency } from 'constants/token/currency'

export default function CurrencyValue({
  currency,
  currencySize,
  value,
  valueSize,
  equivalent,
  equivalentSize
}: {
  currency: Currency
  currencySize?: string
  value: string
  valueSize?: string | number
  equivalent: string
  equivalentSize?: string | number
}) {
  return (
    <Box display="flex" alignItems="center" gap={10}>
      <CurrencyLogo size={currencySize || '32px'} currency={currency} />
      <Box>
        <Typography fontSize={valueSize || 16} fontWeight={500}>
          {value}
        </Typography>
        <Typography fontSize={equivalentSize || 13} fontWeight={400} sx={{ opacity: 0.5 }}>
          {equivalent}
        </Typography>
      </Box>
    </Box>
  )
}
