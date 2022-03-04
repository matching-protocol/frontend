import { Box, Typography } from '@mui/material'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { Currency } from 'constants/token/currency'

export default function CurrencyText({
  currency,
  currencySize,
  text,
  textSize,
  subText,
  subTextSize
}: {
  currency: Currency
  currencySize?: string
  text: string
  textSize?: string | number
  subText: string
  subTextSize?: string | number
}) {
  return (
    <Box display="flex" alignItems="center" gap={10}>
      <CurrencyLogo size={currencySize || '32px'} currency={currency} />
      <Box>
        <Typography fontSize={textSize || 16} fontWeight={500}>
          {text}
        </Typography>
        <Typography fontSize={subTextSize || 13} fontWeight={400} sx={{ opacity: 0.5 }}>
          {subText}
        </Typography>
      </Box>
    </Box>
  )
}
