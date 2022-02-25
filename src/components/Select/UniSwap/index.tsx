import { Box } from '@mui/material'
import ChainSelect from '../ChainSelect'
import { Chain } from 'models/chain'
import { useMemo } from 'react'
import { Currency } from 'constants/token/currency'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

export default function ChainSwap({
  from,
  to,
  list,
  onSelectTo,
  onSelectFrom,
  disabledFrom,
  disabledTo,
  activeFrom,
  activeTo
}: {
  from: Chain | Currency | null
  to: Chain | Currency | null
  list: (Chain | Currency)[]
  onSelectFrom?: (el: Chain | Currency | null) => void
  onSelectTo?: (el: Chain | Currency | null) => void
  disabledFrom?: boolean
  disabledTo?: boolean
  activeFrom?: boolean
  activeTo?: boolean
}) {
  const toList = useMemo(() => {
    return list.filter(el => !(el.symbol === from?.symbol))
  }, [list, from?.symbol])

  return (
    <Box display="flex" gap={16} alignItems="center" justifyContent="space-between" position="relative" width={434}>
      <ChainSelect label="From" list={list} selected={null} width="192px" height="60px" />
      <ArrowForwardIcon sx={{ position: 'absolute', bottom: '18px', left: 'calc(50% - 12px)' }} />
      <ChainSelect label="To" list={toList} selected={null} width="192px" height="60px" />
    </Box>
  )
}
