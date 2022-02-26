import { MenuItem, Box, styled, Typography } from '@mui/material'
import Select from 'components/Select/Select'
import LogoText from 'components/LogoText'
import SelectedIcon from 'assets/componentsIcon/selected_icon.svg'
import { useCallback } from 'react'
import CurrencyLogo from 'components/essential/CurrencyLogo'

function SvgCircle() {
  return (
    <svg height="24" width="24">
      <circle cx="12" cy="12" r="12" fill="#FFFFFF" />
    </svg>
  )
}

// const StyledImgBox = styled(Box)({
//   '& img': {
//     width: '28px',
//     height: '28px'
//   },
//   '& span': {
//     width: '28px',
//     height: '28px',
//     borderRadius: '50%',
//     background: '#FFFFFF'
//   }
// })

export default function SwapSelect({
  label,
  disabled,
  list,
  onChange,
  selected,
  width,
  height,
  active,
  placeholder,
  fontSize
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
  fontSize?: string | number
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
      fontSize={fontSize}
      renderValue={() => (
        <MenuItem
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            '&.Mui-selected': {
              background: 'transparent'
            },
            '&.Mui-selected:hover': {
              background: 'transparent'
            }
          }}
          value={selected?.name ?? ''}
          key={selected?.name ?? ''}
          selected={!!selected}
        >
          {selected ? (
            <LogoText
              logo={selected?.logo || <CurrencyLogo currency={selected} />}
              text={selected?.symbol || 'Select Chain'}
              fontSize={fontSize}
            />
          ) : (
            <Box display="flex" gap={12} alignItems="center">
              <SvgCircle />
              <Typography fontSize={16} fontWeight={500} sx={{ opacity: 0.5 }}>
                Select Chain
              </Typography>
            </Box>
          )}
        </MenuItem>
      )}
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
          <LogoText
            logo={option?.logo || <CurrencyLogo currency={option} />}
            text={option.symbol}
            fontSize={fontSize}
          />
        </MenuItem>
      ))}
    </Select>
  )
}
