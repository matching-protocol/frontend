import { useMemo } from 'react'
import { Typography, Grid, Box } from '@mui/material'
import { Chain } from 'models/chain'
import SwapSelect from 'components/Swap/SwapSelect'
import SwitchButton from '../BiSwap/SwitchButton'
import TextButton from 'components/Button/TextButton'

export default function ChainSwap({
  fromLabel,
  toLabel,
  fromChain,
  toChain,
  chainList,
  onSelectFromChain,
  onSelectToChain,
  onSwitch,
  fromRightLabel,
  toRightLabel,
  disabled
}: {
  fromLabel: string
  toLabel: string
  fromChain: Chain | null
  toChain: Chain | null
  chainList: Chain[]
  onSelectFromChain: (e: any) => void
  onSelectToChain: (e: any) => void
  onSwitch?: () => void
  fromRightLabel?: string
  toRightLabel?: string
  disabled?: boolean
}) {
  const fromList = useMemo(() => {
    return chainList.filter(chain => chain.id !== toChain?.id)
  }, [chainList, toChain?.id])

  const toList = useMemo(() => {
    return chainList.filter(chain => chain.id !== fromChain?.id)
  }, [chainList, fromChain?.id])

  return (
    <Grid container columnSpacing={20} rowSpacing={8} position="relative">
      <TextButton
        onClick={onSwitch}
        style={{
          position: 'absolute',
          left: 'calc(50% - 8px)',
          zIndex: 1,
          padding: 0,
          height: 32,
          bottom: 14
        }}
      >
        <SwitchButton />
      </TextButton>
      <Grid item md={6}>
        <Box display={'flex'} justifyContent="space-between" alignItems={'center'}>
          <Typography fontSize={16} fontWeight={700}>
            {fromLabel}
          </Typography>
          {fromRightLabel && (
            <Typography mr={10} fontSize={14} fontWeight={500} color="rgba(22, 22, 22, 0.5)">
              {fromRightLabel}
            </Typography>
          )}
        </Box>
        <SwapSelect
          disabled={disabled}
          menuWidth={320}
          list={fromList}
          selected={fromChain}
          height="60px"
          onChange={onSelectFromChain}
        />
      </Grid>
      <Grid item md={6}>
        <Box display={'flex'} justifyContent="space-between" alignItems={'center'}>
          <Typography fontSize={16} fontWeight={700}>
            {toLabel}
          </Typography>
          {toRightLabel && (
            <Typography fontSize={14} fontWeight={500} color="rgba(22, 22, 22, 0.5)">
              {toRightLabel}
            </Typography>
          )}
        </Box>
        <SwapSelect
          disabled={disabled}
          menuWidth={320}
          list={toList}
          selected={toChain}
          height="60px"
          onChange={onSelectToChain}
        />
      </Grid>
    </Grid>
  )
}
