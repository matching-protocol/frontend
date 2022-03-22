import CurrencyText from 'components/CurrencyText'
import { CurrencyAmount, Token, TokenAmount } from 'constants/token'
import { useMemo } from 'react'
import { useLocalCurrency } from 'state/token/hooks'

export default function CurrencyInfo({
  currencySize,
  textSize,
  address,
  chainId,
  amount
}: {
  currencySize?: string
  textSize?: string | number
  chainId?: number
  address: string
  amount?: string
}) {
  const token = useLocalCurrency(chainId, address)
  const tokenAmount = useMemo(() => {
    if (amount && token) {
      if (token instanceof Token) {
        return new TokenAmount(token, amount)
      }
      return CurrencyAmount.getEther(token, amount)
    }
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
