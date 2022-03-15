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
  const fromList = useMemo(() => {
    return list.filter(el => !(el.symbol === to?.symbol))
  }, [list, to?.symbol])

  const toList = useMemo(() => {
    return list.filter(el => !(el.symbol === from?.symbol))
  }, [list, from?.symbol])

  return (
    <Box display="flex" gap={50} alignItems="center" justifyContent="space-between" position="relative" width={'100%'}>
      <SwapSelect
        // label="From"
        list={fromList}
        selected={from}
        width="50%"
        defaultText="From Chain"
        height="60px"
        onChange={onSelectFrom}
        disabled={disabledFrom}
        active={activeFrom}
      />
      <ArrowForwardIcon
        onClick={() => {
          onSelectFrom && onSelectFrom(to)
          onSelectTo && onSelectTo(from)
        }}
        sx={{ position: 'absolute', bottom: '18px', left: 'calc(50% - 12px)', cursor: 'pointer' }}
      />
      <SwapSelect
        // label="To"
        list={toList}
        defaultText="To Chain"
        selected={to}
        width="50%"
        height="60px"
        onChange={onSelectTo}
        disabled={disabledTo}
        active={activeTo}
      />
    </Box>
  )
}
