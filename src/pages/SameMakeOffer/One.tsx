import { Box, Typography, useTheme } from '@mui/material'
import SelectButton from 'components/Button/SelectButton'
import LogoText from 'components/LogoText'
import { Currency, CurrencyAmount } from 'constants/token'
import ChainSwap from 'components/Swap/ChainSwap'
import { Chain } from 'models/chain'
import NumericalInput from 'components/Input/InputNumerical'
import CurrencyLogo from 'components/essential/CurrencyLogo'

export default function One({
  currency,
  onSelectCurrency,
  chainList,
  fromChain,
  toChain,
  onSelectFromChain,
  onSelectToChain,
  onSwitch,
  amount,
  onAmount,
  nextBtn,
  currencyAmount
}: {
  currency: Currency | null
  onSelectCurrency: () => void
  chainList: Chain[]
  fromChain: Chain | null
  toChain: Chain | null
  onSelectFromChain: (e: any) => void
  onSelectToChain: (e: any) => void
  onSwitch: () => void
  amount: string
  onAmount: (val: string) => void
  nextBtn: JSX.Element
  currencyAmount?: CurrencyAmount
}) {
  const theme = useTheme()
  return (
    <Box display="grid" gap={35}>
      <Box display="grid" gap={8}>
        <Typography fontSize={14} fontWeight={500} color={theme.palette.primary.light}>
          Asset:
        </Typography>
        <SelectButton
          style={{
            justifyContent: 'space-between',
            padding: '0 20px'
          }}
          width="100%"
          onClick={onSelectCurrency}
        >
          {currency ? (
            <LogoText logo={currency.logo || ''} text={currency.symbol || ''} />
          ) : (
            <Typography fontSize="16px" color={'rgba(22, 22, 22, 0.5)'}>
              Select currency
            </Typography>
          )}
        </SelectButton>
      </Box>
      <Box display="grid" gap={8}>
        <Typography fontSize={14} fontWeight={500} color={theme.palette.primary.light}>
          Chain:
        </Typography>
        <ChainSwap
          fromLabel="Origin Chain"
          toLabel="Destination Chain"
          fromChain={fromChain}
          toChain={toChain}
          chainList={chainList}
          onSelectFromChain={onSelectFromChain}
          onSelectToChain={onSelectToChain}
          onSwitch={onSwitch}
          disabled={!currency}
        />
      </Box>
      <NumericalInput
        label="Amount"
        value={amount}
        onChange={e => onAmount(e.target.value)}
        balance={currencyAmount?.toSignificant(6, { groupSeparator: ',' } || '-')}
        unit={currencyAmount?.currency.symbol}
        endAdornment={
          currencyAmount ? (
            <Box display={'flex'} gap={5} pl={5} alignItems="center">
              <CurrencyLogo size="18px" currency={currencyAmount.currency} />
              {currencyAmount.currency.symbol}
            </Box>
          ) : (
            undefined
          )
        }
      />
      {nextBtn}
    </Box>
  )
}
