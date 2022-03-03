import { ChangeEvent } from 'react'
import { Box, Typography } from '@mui/material'
import Input from 'components/Input'
import { Currency } from 'constants/token/currency'
import SelectButton from 'components/Button/SelectButton'
import LogoText from 'components/LogoText'
import CurrencyLogo from 'components/essential/CurrencyLogo'

export default function SwapSelectInput({
  value,
  selected,
  selectPlaceholder,
  inputPlaceholder,
  onClick,
  onChange,
  width
}: {
  value: string
  options: Currency[]
  selected: Currency | null
  selectPlaceholder?: string
  inputPlaceholder?: string
  onClick: () => void
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  width?: number | string
}) {
  return (
    <Box
      width={width || '100%'}
      height={108}
      display="flex"
      gap={50}
      bgcolor="#F7F7F8"
      borderRadius="16px"
      alignItems="center"
      padding={24}
    >
      <SelectButton onClick={onClick} width="120px">
        {selected ? (
          <LogoText logo={<CurrencyLogo currency={selected} />} text={selected?.symbol ?? ''} />
        ) : (
          <Typography fontSize="24px" fontWeight={500} color={'rgba(22, 22, 22, 0.5)'}>
            {selectPlaceholder || 'Asset'}
          </Typography>
        )}
      </SelectButton>
      <Input
        width={160}
        value={value}
        placeholder={inputPlaceholder}
        onChange={onChange}
        backgroundColor="#FFFFFF"
        fontSize={24}
      />
    </Box>
  )
}
