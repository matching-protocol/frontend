import { ChangeEvent } from 'react'
import { Box, Typography } from '@mui/material'
import { Chain } from 'models/chain'
import { Currency } from 'constants/token/currency'
import SwapSelect from 'components/Swap/SwapSelect'
import SwapSelectInput from 'components/Swap/SwapSelectInput'
import SwitchButton from './SwitchButton'
import TextButton from 'components/Button/TextButton'

export default function BiSwap({
  fromLabel,
  toLabel,
  fromChain,
  toChain,
  fromCurrency,
  toCurrency,
  fromValue,
  toValue,
  chainList,
  currencyList,
  onSelectFromChain,
  onSelectToChain,
  onSelectFromCurrency,
  onSelectToCurrency,
  onChangeFromValue,
  onChangeToValue,
  fromSubStr,
  toSubStr
}: {
  fromLabel: string
  toLabel: string
  fromChain: Chain | null
  toChain: Chain | null
  fromCurrency: Currency | null
  toCurrency: Currency | null
  fromValue: string
  toValue: string
  chainList: Chain[]
  currencyList: Currency[]
  onSelectFromChain: (e: any) => void
  onSelectToChain: (e: any) => void
  onSelectFromCurrency: () => void
  onSelectToCurrency: () => void
  onChangeFromValue: (e: ChangeEvent<HTMLInputElement>) => void
  onChangeToValue: (e: ChangeEvent<HTMLInputElement>) => void
  fromSubStr?: string
  toSubStr?: string
}) {
  const handleSwitch = () => {
    // if (!onSelectTo || !onSelectFrom) return
    // onSelectFrom(to)
    // onSelectTo(from)
  }

  // const toList = useMemo(() => {
  //   return list.filter(chain => !(chain.symbol === from?.symbol))
  // }, [list, from?.symbol])

  return (
    <Box display="grid" gap={8}>
      <Box display="flex" gap={20}>
        <Box width={344}>
          <Typography fontSize={16} fontWeight={700} mb={16}>
            {fromLabel}
          </Typography>
          <SwapSelect list={chainList} selected={fromChain} height="60px" onChange={onSelectFromChain} />
        </Box>
        <Box width={344}>
          <Typography fontSize={16} fontWeight={700} mb={16}>
            {toLabel}
          </Typography>
          <SwapSelect list={chainList} selected={toChain} height="60px" onChange={onSelectToChain} />
        </Box>
      </Box>

      <Box display="flex" alignItems="center" position="relative" gap={20}>
        <SwapSelectInput
          value={fromValue}
          options={currencyList}
          selected={fromCurrency}
          onClick={onSelectFromCurrency}
          onChange={onChangeFromValue}
          inputPlaceholder={'0.00'}
        />
        <TextButton
          onClick={handleSwitch}
          style={{
            position: 'absolute',
            left: 'calc(50% - 16px)',
            zIndex: 1,
            padding: 0,
            height: 32,
            bottom: 38
          }}
        >
          <SwitchButton />
        </TextButton>
        <SwapSelectInput
          value={toValue}
          options={currencyList}
          selected={toCurrency}
          onClick={onSelectToCurrency}
          onChange={onChangeToValue}
          inputPlaceholder={'0.00'}
        />
      </Box>

      {(fromSubStr || toSubStr) && (
        <Box display="flex" alignItems="center" gap={20}>
          <Typography width={344} fontSize={11} sx={{ opacity: 0.5 }}>
            {fromSubStr || ''}
          </Typography>
          <Typography width={344} fontSize={11} sx={{ opacity: 0.5 }}>
            {toSubStr || ''}
          </Typography>
        </Box>
      )}
    </Box>
  )
}
