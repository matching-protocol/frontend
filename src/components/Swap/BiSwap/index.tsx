import { ChangeEvent, useMemo } from 'react'
import { Typography, Grid, Box } from '@mui/material'
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
  onSelectFromChain,
  onSelectToChain,
  onSelectFromCurrency,
  onSelectToCurrency,
  onChangeFromValue,
  onChangeToValue,
  fromSubStr,
  toSubStr,
  onSwitch,
  fromRightLabel,
  toRightLabel,
  onFromMax
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
  // currencyList: Currency[]
  onSelectFromChain: (e: any) => void
  onSelectToChain: (e: any) => void
  onSelectFromCurrency: () => void
  onSelectToCurrency: () => void
  onChangeFromValue: (e: ChangeEvent<HTMLInputElement>) => void
  onChangeToValue: (e: ChangeEvent<HTMLInputElement>) => void
  fromSubStr?: string
  toSubStr?: string
  onSwitch?: () => void
  fromRightLabel?: string
  toRightLabel?: string
  onFromMax?: () => void
}) {
  // const handleSwitch = () => {
  //   onSelectFromChain(toChain)
  //   onSelectToChain(fromChain)
  //   onSelectFromCurrency(toCurrency)
  //   onSelectToCurrency(fromCurrency)
  // }

  // const onSwitch = useCallback(() => {
  //   onSelectFromChain(toChain)
  //   onSelectToChain(fromChain)
  // }, [])

  const fromList = useMemo(() => {
    return chainList.filter(chain => chain.id !== toChain?.id)
  }, [chainList, toChain?.id])

  const toList = useMemo(() => {
    return chainList.filter(chain => chain.id !== fromChain?.id)
  }, [chainList, fromChain?.id])

  return (
    <Grid container columnSpacing={20} rowSpacing={8}>
      <Grid item md={6}>
        <Box display={'flex'} justifyContent="space-between" alignItems={'center'} mb={24}>
          <Typography fontSize={16} fontWeight={700}>
            {fromLabel}
          </Typography>
          {fromRightLabel && (
            <Typography mr={10} fontSize={14} fontWeight={500} color="rgba(22, 22, 22, 0.5)">
              {fromRightLabel}
            </Typography>
          )}
        </Box>
        <SwapSelect menuWidth={320} list={fromList} selected={fromChain} height="60px" onChange={onSelectFromChain} />
      </Grid>
      <Grid item md={6}>
        <Box display={'flex'} justifyContent="space-between" alignItems={'center'} mb={24}>
          <Typography fontSize={16} fontWeight={700}>
            {toLabel}
          </Typography>
          {toRightLabel && (
            <Typography fontSize={14} fontWeight={500} color="rgba(22, 22, 22, 0.5)">
              {toRightLabel}
            </Typography>
          )}
        </Box>
        <SwapSelect menuWidth={320} list={toList} selected={toChain} height="60px" onChange={onSelectToChain} />
      </Grid>
      <Grid item md={6} position="relative">
        <SwapSelectInput
          value={fromValue}
          selected={fromCurrency}
          onClick={onSelectFromCurrency}
          onChange={onChangeFromValue}
          inputPlaceholder={'0.00'}
          onMax={onFromMax}
        />
        <TextButton
          onClick={onSwitch}
          style={{
            position: 'absolute',
            right: -26,
            zIndex: 1,
            padding: 0,
            height: 32,
            bottom: 38
          }}
        >
          <SwitchButton />
        </TextButton>
      </Grid>
      <Grid item md={6}>
        <SwapSelectInput
          value={toValue}
          selectDisabled
          selected={toCurrency}
          onClick={onSelectToCurrency}
          onChange={onChangeToValue}
          inputDisabled={true}
          inputPlaceholder={'0.00'}
          hideSelectArrow={true}
        />
      </Grid>
      <Grid item md={6}>
        <Typography fontSize={11} sx={{ opacity: 0.5 }}>
          {fromSubStr || ''}
        </Typography>
      </Grid>
      <Grid item md={6}>
        <Typography fontSize={11} sx={{ opacity: 0.5 }}>
          {toSubStr || ''}
        </Typography>
      </Grid>
    </Grid>
  )
}
