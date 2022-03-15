import CurrencyText from 'components/CurrencyText'
import { TokenAmount } from 'constants/token'
import { useLocalCurrency } from 'hooks/useCurrencyList'
import { useMemo } from 'react'

export default function CurrencyInfo({
  currencySize,
  textSize,
  subTextSize,
  address,
  amount
}: {
  currencySize?: string
  textSize?: string | number
  subTextSize?: string | number
  chainId?: number
  address: string
  amount?: string
}) {
  const token = useLocalCurrency(address)
  const tokenAmount = useMemo(() => {
    if (amount && token) return new TokenAmount(token, amount)
    return undefined
  }, [amount, token])
  if (!token) {
    return <>-</>
  }
  return (
    <CurrencyText
      key={1}
      currency={token}
      currencySize={currencySize}
      text={token.symbol || ''}
      subText={tokenAmount?.toSignificant(6, { groupSeparator: ',' }) || ''}
      textSize={textSize}
      subTextSize={subTextSize}
    />
  )
}
