import { Box, Typography } from '@mui/material'
import Input from 'components/Input'
import { Currency } from 'constants/token/currency'
import SelectButton from 'components/Button/SelectButton'
import LogoText from 'components/LogoText'
import CurrencyLogo from 'components/essential/CurrencyLogo'

export default function SwapSelectInput({
  width,
  value,
  selected,
  selectPlaceholder,
  inputPlaceholder,
  onClick
}: {
  value: string
  options: Currency[]
  selected: Currency | null
  selectPlaceholder?: string
  inputPlaceholder?: string
  width?: number | string
  onClick?: () => void
}) {
  return (
    <Box width={width || '100%'}>
      <SelectButton onClick={onClick}>
        {selected ? (
          <LogoText logo={<CurrencyLogo currency={selected} />} text={selected?.symbol ?? ''} />
        ) : (
          <Typography fontSize="16px" color={'rgba(22, 22, 22, 0.5)'}>
            {selectPlaceholder || 'Asset'}
          </Typography>
        )}
      </SelectButton>
      <Input value={value} placeholder={inputPlaceholder} />
    </Box>
  )
}
