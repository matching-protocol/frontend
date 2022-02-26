import { Box } from '@mui/material'
import SwapSelect from '../SwapSelect'
import { useMemo } from 'react'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

export default function UniSwap({
  from,
  to,
  list,
  onSelectFrom,
  onSelectTo,
  disabledFrom,
  disabledTo,
  activeFrom,
  activeTo
}: {
  from: any
  to: any
  list: any[]
  onSelectFrom?: (e: any) => void
  onSelectTo?: (e: any) => void
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
      <SwapSelect
        label="From"
        list={list}
        selected={from}
        width="192px"
        height="60px"
        onChange={onSelectFrom}
        disabled={disabledFrom}
        active={activeFrom}
      />
      <ArrowForwardIcon sx={{ position: 'absolute', bottom: '18px', left: 'calc(50% - 12px)' }} />
      <SwapSelect
        label="To"
        list={toList}
        selected={to}
        width="192px"
        height="60px"
        onChange={onSelectTo}
        disabled={disabledTo}
        active={activeTo}
      />
    </Box>
  )
}
