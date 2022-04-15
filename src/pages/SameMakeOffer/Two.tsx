import { Box, Grid, styled, Typography } from '@mui/material'
import OutlineButton from 'components/Button/OutlineButton'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import NumericalInput from 'components/Input/InputNumerical'
import { CurrencyAmount, Fraction } from 'constants/token'
import { Rounding } from 'constants/token/constants'
import { useIncentiveList } from 'hooks/useIncentive'
import { useCallback } from 'react'

const IncentiveBox = styled(Box)(({ theme }) => ({
  padding: '8px 15px',
  border: '1px solid #D9D9DA',
  borderRadius: '16px',
  cursor: 'pointer',
  '&:hover': {
    background: theme.bgColor.bg3,
    borderColor: theme.bgColor.bg3,
    color: '#fff'
  }
}))

export default function Two({
  amount,
  onAmount,
  nextBtn,
  remainingAmount,
  exchangeTokenAmount,
  onBack
}: {
  amount: string
  onAmount: (val: string) => void
  nextBtn: JSX.Element
  remainingAmount?: CurrencyAmount
  exchangeTokenAmount?: CurrencyAmount
  onBack?: () => void
}) {
  const incentiveList = useIncentiveList(exchangeTokenAmount)

  const ceilAmountCallback = useCallback(
    (ca: Fraction | CurrencyAmount | undefined) => {
      if (!ca) {
        onAmount('0')
        return
      }
      const val = ca.toSignificant(6, undefined, Rounding.ROUND_UP)
      onAmount(val)
    },
    [onAmount]
  )

  return (
    <Box display={'grid'} gap="40px">
      <Box
        padding={'17px 32px'}
        sx={{
          backgroundColor: '#F7F7F8',
          borderRadius: '16px',
          color: 'rgba(0, 0, 0, 0.6)'
        }}
      >
        <Typography>
          <b>Note:</b> Incentive is how much you are willing to pay for the market to fill your order. The more
          incentive you give, the faster your offer will be filled.
        </Typography>
      </Box>
      <Box mt="15px" display={'grid'} gap="20px">
        <NumericalInput
          placeholder="Please enter the incentive amount"
          label="Incentive"
          value={amount}
          onChange={e => onAmount(e.target.value)}
          balance={remainingAmount?.toSignificant(6, { groupSeparator: ',' } || '-')}
          unit={remainingAmount?.currency.symbol}
          endAdornment={
            remainingAmount ? (
              <Box display={'flex'} gap={5} pl={5} alignItems="center">
                <CurrencyLogo size="18px" currency={remainingAmount.currency} />
                {remainingAmount.currency.symbol}
              </Box>
            ) : (
              undefined
            )
          }
        />
        <Grid container spacing={20}>
          <Grid item md={4} xs={12}>
            <IncentiveBox onClick={() => ceilAmountCallback(incentiveList?.suggested)}>
              <Typography>Suggested Amount</Typography>
              <Typography>
                {incentiveList.suggested?.toSignificant(6, { groupSeparator: ',' })} {remainingAmount?.currency.symbol}
              </Typography>
            </IncentiveBox>
          </Grid>
          <Grid item md={4} xs={12}>
            <IncentiveBox onClick={() => ceilAmountCallback(incentiveList?.fast)}>
              <Typography>Fast</Typography>
              <Typography>
                {incentiveList.fast?.toSignificant(6, { groupSeparator: ',' })} {remainingAmount?.currency.symbol}
              </Typography>
            </IncentiveBox>
          </Grid>
          <Grid item md={4} xs={12}>
            <IncentiveBox onClick={() => ceilAmountCallback(incentiveList?.min)}>
              <Typography>Min</Typography>
              <Typography>
                {incentiveList.min?.toSignificant(6, { groupSeparator: ',' })} {remainingAmount?.currency.symbol}
              </Typography>
            </IncentiveBox>
          </Grid>
        </Grid>
      </Box>
      <Box display={'flex'} gap="20px" mt={30} justifyContent={'space-between'}>
        <OutlineButton primary onClick={onBack}>
          Back
        </OutlineButton>
        {nextBtn}
      </Box>
    </Box>
  )
}
