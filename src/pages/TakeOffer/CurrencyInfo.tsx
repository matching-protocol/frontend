import CurrencyText from 'components/CurrencyText'
import { TokenAmount } from 'constants/token'
import { useLocalCurrency } from 'hooks/useCurrencyList'
import { useMemo } from 'react'

export default function CurrencyInfo({
  currencySize,
  textSize,
  address,
  amount
}: {
  currencySize?: string
  textSize?: string | number
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
      currency={token}
      currencySize={currencySize}
      text={tokenAmount ? tokenAmount.toSignificant(6, { groupSeparator: ',' }) + ' ' + token.symbol : '-'}
      textSize={textSize}
      subText={''}
    />
  )
}
