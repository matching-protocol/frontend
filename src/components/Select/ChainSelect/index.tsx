import { MenuItem, Box } from '@mui/material'
import Select from 'components/Select/Select'
import LogoText from 'components/LogoText'
import InputLabel from 'components/Input/InputLabel'
import SelectedIcon from 'assets/componentsIcon/selected_icon.svg'
import { useCallback } from 'react'
import { Chain } from 'models/chain'
import { Currency } from 'constants/token/currency'
import CurrencyLogo from 'components/essential/CurrencyLogo'

export default function ChainSelect({
  label,
  disabled,
  list,
  onChange,
  selected,
  width,
  height,
  active,
  placeholder
}: {
  label?: string
  disabled?: boolean
  list: (Chain | Currency)[]
  selected: Chain | Currency | null
  onChange?: (el: Chain | Currency | null) => void
  width?: string
  height?: string
  active?: boolean
  placeholder?: string
}) {
  const handleChange = useCallback(
    e => {
      const chain = list.find(chain => chain.symbol === e.target.value) ?? null
      onChange && onChange(chain)
    },
    [list, onChange]
  )

  return (
    <Box width={width} position="relative">
      {label && <InputLabel style={{ fontSize: 14 }}>{label}</InputLabel>}
      <Select
        defaultValue={selected?.symbol}
        value={selected?.symbol ?? ''}
        disabled={disabled}
        onChange={handleChange}
        placeholder={placeholder ?? 'Select Chain'}
        width={'100%'}
        height={height}
        primary={active}
      >
        {list.map(option => (
          <MenuItem
            sx={{
              '&::before': {
                content: '""',
                width: 30,
                height: 20,
                display: 'flex',
                justifyContent: 'center'
              },
              '&.Mui-selected::before': {
                content: `url(${SelectedIcon})`,
                width: 30,
                height: 20,
                display: 'flex',
                justifyContent: 'center'
              }
            }}
            value={option.symbol}
            key={option.symbol}
            selected={selected?.symbol === option.symbol}
          >
            <LogoText logo={isChain(option) ? option.logo : <CurrencyLogo currency={option} />} text={option.symbol} />
          </MenuItem>
        ))}
      </Select>
    </Box>
  )
}

function isChain(el: Chain | Currency): el is Chain {
  return (el as Chain).logo !== undefined
}
