import { Box } from '@mui/material'
import TextButton from 'components/Button/TextButton'
import ChainSelect from '../ChainSelect'
import { Chain } from 'models/chain'
import SwitchButton from './SwitcherButton'
import { useMemo } from 'react'
import { Currency } from 'constants/token/currency'

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
  const handleSwitch = () => {
    if (!onSelectTo || !onSelectFrom) return

    onSelectFrom(to)
    onSelectTo(from)
  }

  const toList = useMemo(() => {
    return list.filter(chain => !(chain.symbol === from?.symbol))
  }, [list, from?.symbol])

  return (
    <Box display="flex" justifyContent="space-between" alignItems={'flex-end'} position={'relative'} width="100%">
      <ChainSelect
        label={'From'}
        selected={from}
        list={list}
        onChange={onSelectFrom}
        width={'49%'}
        disabled={disabledFrom}
        active={activeFrom}
      />
      <Box position={'absolute'} left={'calc(50% - 16px)'} zIndex={99} padding="0px" height="32px" bottom="8px">
        <TextButton onClick={handleSwitch} disabled={disabledFrom || disabledTo || !onSelectTo || !onSelectFrom}>
          <SwitchButton />
        </TextButton>
      </Box>
      <ChainSelect
        label={'To'}
        selected={to}
        list={toList}
        onChange={onSelectTo}
        width={'49%'}
        disabled={disabledTo}
        active={activeTo}
      />
    </Box>
  )
}
