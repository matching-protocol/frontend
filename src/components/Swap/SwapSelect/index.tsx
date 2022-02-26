import { MenuItem } from '@mui/material'
import Select from 'components/Select/Select'
import LogoText from 'components/LogoText'
import SelectedIcon from 'assets/componentsIcon/selected_icon.svg'
import { useCallback } from 'react'
import CurrencyLogo from 'components/essential/CurrencyLogo'

export default function SwapSelect({
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
  list: any[]
  selected: any
  onChange?: (e: any) => void
  width?: string
  height?: string
  active?: boolean
  placeholder?: string
}) {
  const handleChange = useCallback(
    e => {
      const el = list.find(el => el.symbol === e.target.value) ?? null
      onChange && onChange(el)
    },
    [list, onChange]
  )

  return (
    <Select
      width={width || '100%'}
      label={label}
      defaultValue={selected?.symbol}
      value={selected?.symbol ?? ''}
      disabled={disabled}
      onChange={handleChange}
      placeholder={placeholder ?? ''}
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
          <LogoText logo={option?.logo || <CurrencyLogo currency={option} />} text={option.symbol} />
        </MenuItem>
      ))}
    </Select>
  )
}
