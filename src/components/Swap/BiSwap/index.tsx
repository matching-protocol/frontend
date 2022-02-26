// import { useMemo } from 'react'
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
  onSelectToCurrency
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
  onSelectFromCurrency: (e: any) => void
  onSelectToCurrency: (e: any) => void
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
    <Box display="flex" justifyContent="space-between">
      <Box width={344}>
        <Typography fontSize={16} fontWeight={700}>
          {fromLabel}
        </Typography>
        <SwapSelect list={chainList} selected={fromChain} width="192px" height="60px" onChange={onSelectFromChain} />
      </Box>
      <Box width={344}>
        <Typography fontSize={16} fontWeight={700}>
          {toLabel}
        </Typography>
        <SwapSelect list={chainList} selected={toChain} width="192px" height="60px" onChange={onSelectToChain} />
      </Box>
      <Box display="flex" alignItems="center">
        <SwapSelectInput
          value={fromValue}
          options={currencyList}
          selected={fromCurrency}
          onChange={onSelectFromCurrency}
        />
        <Box position={'absolute'} left={'calc(50% - 16px)'} zIndex={99} padding="0px" height="32px" bottom="8px">
          <TextButton onClick={handleSwitch}>
            <SwitchButton />
          </TextButton>
        </Box>
        <SwapSelectInput value={toValue} options={currencyList} selected={toCurrency} onChange={onSelectToCurrency} />
      </Box>
    </Box>
  )
}
