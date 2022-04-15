import { Box, Typography, useTheme } from '@mui/material'
import OutlineButton from 'components/Button/OutlineButton'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { ChainId, ChainListMap } from 'constants/chain'
import { Currency, CurrencyAmount } from 'constants/token'
import { useMemo } from 'react'
import { ExternalLink } from 'theme/components'
import { getEtherscanLink } from 'utils'

export default function Three({
  nextBtn,
  exchangeCurrencyAmount,
  incentiveAmount,
  toCurrency,
  onBack
}: {
  nextBtn: JSX.Element
  incentiveAmount?: CurrencyAmount
  exchangeCurrencyAmount?: CurrencyAmount
  onBack?: () => void
  toCurrency?: Currency
}) {
  const theme = useTheme()

  const tokenSymbol = useMemo(() => exchangeCurrencyAmount?.currency.symbol, [exchangeCurrencyAmount])

  if (!exchangeCurrencyAmount || !incentiveAmount) return null

  return (
    <Box display={'grid'} gap="16px">
      <Box
        sx={{
          backgroundColor: '#F7F7F8',
          borderRadius: '16px',
          padding: 40
        }}
      >
        <Box display="flex" justifyContent={'space-between'} sx={{ paddingLeft: '5%' }}>
          <Box display="grid" gridTemplateColumns={'120px 1fr'}>
            <Box display={'flex'} gap="10px" alignItems={'center'}>
              <CircleSvg />
              <Typography fontSize={12} color={theme.palette.primary.light}>
                You pay
              </Typography>
            </Box>
            <Box display={'flex'} alignItems="center" gap="5px">
              <CurrencyLogo currency={exchangeCurrencyAmount.currency} />
              <Typography fontSize={18} fontWeight={700}>
                {exchangeCurrencyAmount.add(incentiveAmount).toSignificant(6, { groupSeparator: ',' })} {tokenSymbol}
              </Typography>
              <Typography fontSize={12} color={'#1F191B'}>
                / <ShowChain chainId={exchangeCurrencyAmount.currency.chainId} />
              </Typography>
            </Box>
          </Box>
          <Box>
            <ExternalLink
              href={getEtherscanLink(
                exchangeCurrencyAmount.currency.chainId || 1,
                exchangeCurrencyAmount.currency.address,
                'token'
              )}
              underline="none"
              sx={{
                fontWeight: 500,
                fontSize: 12,
                color: theme.palette.primary.light,
                borderBottom: '1px solid rgba(22, 22, 22, 0.4)'
              }}
            >
              View on <ShowChain chainId={exchangeCurrencyAmount.currency.chainId} />
            </ExternalLink>
          </Box>
        </Box>
        <Box display="flex" justifyContent={'space-between'} margin="5px 0" sx={{ paddingLeft: '5%' }}>
          <Box display="grid" gridTemplateColumns={'120px 1fr'}>
            <Box sx={{ borderLeft: '2px dotted #000', marginLeft: 8 }}></Box>
            <Box height={90}>
              <Typography fontSize={12} color="#1F191B" fontWeight={500}>
                {exchangeCurrencyAmount.toSignificant(6, { groupSeparator: ',' })}
                {tokenSymbol}(You pay)
              </Typography>
              <Typography fontSize={12} color="#1F191B" fontWeight={500}>
                {incentiveAmount.toSignificant(6, { groupSeparator: ',' })}
                {tokenSymbol}(Offer Incentive)
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box display="flex" justifyContent={'space-between'} sx={{ paddingLeft: '5%' }}>
          <Box display="grid" gridTemplateColumns={'120px 1fr'}>
            <Box display={'flex'} gap="10px" alignItems={'center'}>
              <CircleSvg stroke="#FF9800" />
              <Typography fontSize={12} color={theme.palette.primary.light}>
                You receive
              </Typography>
            </Box>
            <Box display={'flex'} alignItems="center" gap="5px">
              <CurrencyLogo currency={exchangeCurrencyAmount.currency} />
              <Typography fontSize={18} fontWeight={700}>
                {exchangeCurrencyAmount.toSignificant(6, { groupSeparator: ',' })} {tokenSymbol}
              </Typography>
              <Typography fontSize={12} color={'#1F191B'}>
                / <ShowChain chainId={toCurrency?.chainId} />
              </Typography>
            </Box>
          </Box>
          <Box>
            <ExternalLink
              href={getEtherscanLink(toCurrency?.chainId || 1, toCurrency?.address || '', 'token')}
              underline="none"
              sx={{
                fontWeight: 500,
                fontSize: 12,
                color: theme.palette.primary.light,
                borderBottom: '1px solid rgba(22, 22, 22, 0.4)'
              }}
            >
              View on <ShowChain chainId={toCurrency?.chainId} />
            </ExternalLink>
          </Box>
        </Box>
      </Box>
      <Box
        padding={'17px 32px'}
        sx={{
          backgroundColor: '#F7F7F8',
          borderRadius: '16px',
          color: 'rgba(0, 0, 0, 0.6)'
        }}
      >
        <Typography>
          Your principle: {exchangeCurrencyAmount.toSignificant(6, { groupSeparator: ',' })}
          {tokenSymbol} + Your offer incentive {incentiveAmount.toSignificant(6, { groupSeparator: ',' })} {tokenSymbol}
        </Typography>
      </Box>
      <Box display={'flex'} mt={60} gap="20px" justifyContent={'space-between'}>
        <OutlineButton primary onClick={onBack}>
          Back
        </OutlineButton>
        {nextBtn}
      </Box>
    </Box>
  )
}

export function CircleSvg({ stroke }: { stroke?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8.99993 0.999956C13.4183 0.999956 16.9999 4.58165 16.9999 8.9999C16.9999 13.4181 13.4183 16.9998 8.99993 16.9998C4.58167 16.9998 0.999935 13.4181 0.999935 8.9999C0.999935 4.58166 4.58167 0.999956 8.99993 0.999956Z"
        fill="#71D875"
        fillOpacity="0.01"
        stroke={stroke || '#71D875'}
        strokeWidth="2"
      />
    </svg>
  )
}

export function ShowChain({ chainId }: { chainId?: ChainId }) {
  if (!chainId || !ChainListMap[chainId]) return null
  return (
    <>
      <img src={ChainListMap[chainId].logo} alt="" style={{ maxHeight: 14, maxWidth: 14, margin: '0 3px' }} />
      {ChainListMap[chainId].name}
    </>
  )
}
