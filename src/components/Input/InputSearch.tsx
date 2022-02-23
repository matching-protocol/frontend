import { ChangeEvent } from 'react'
import Input from './'
import SearchIcon from 'assets/images/search.png'
import Image from 'components/Image'

export default function InputSearch({
  value,
  width,
  onChange
}: {
  value: string
  width: string | number
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <Input
      placeholder="Order ID Search"
      value={value}
      maxWidth={width}
      startAdornment={<Image src={SearchIcon} />}
      outlined
      onChange={onChange}
    />
  )
}
