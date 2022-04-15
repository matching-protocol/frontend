import { tryParseAmount } from 'utils/parseAmount'
import { Currency } from 'constants/token/currency'
import JSBI from 'jsbi'
import { useMemo } from 'react'
import { CurrencyAmount, Fraction } from 'constants/token'

export function useMinIncentive(currency?: Currency, value?: string) {
  return useMemo(() => {
    const inputAmount = tryParseAmount(value, currency)
    if (!inputAmount) {
      return undefined
    }
    const min = inputAmount.multiply(JSBI.BigInt(2)).divide(JSBI.BigInt(100))
    return min
  }, [currency, value])
}

export function useCurrentIncentive(
  incentive: string,
  setIncentive: (val: string) => void,
  currency?: Currency,
  value?: string
) {
  const min = useMinIncentive(currency, value)
  return useMemo(() => {
    const inputAmount = tryParseAmount(value, currency)
    if (!min || !inputAmount) {
      setIncentive('')
      return ''
    }

    const incentiveAmount = tryParseAmount(incentive, currency)
    if (incentiveAmount?.toSignificant(6) === min.toSignificant(6)) {
      return incentiveAmount.raw.toString()
    }

    const minAmount = tryParseAmount(min.toSignificant(6), currency) as CurrencyAmount
    if (incentiveAmount?.greaterThan(inputAmount)) {
      setIncentive(inputAmount.toSignificant(6))
      return inputAmount.raw.toString()
    }
    if (incentiveAmount?.greaterThan(minAmount)) {
      setIncentive(incentiveAmount.toSignificant(6))
      return incentiveAmount.raw.toString()
    } else {
      setIncentive(minAmount.toSignificant(6))
      return minAmount.raw.toString()
    }
  }, [value, currency, min, incentive, setIncentive])
}

export function useReceiveValue(currency: Currency | undefined, value: string, incentive: string) {
  return useMemo(() => {
    if (!value || !incentive || !currency) return undefined
    const valueAmount = tryParseAmount(value, currency)
    const incentiveAmount = tryParseAmount(incentive, currency)
    if (!valueAmount || !incentiveAmount) {
      return undefined
    }
    if (incentiveAmount.greaterThan(valueAmount)) return undefined
    return valueAmount.subtract(incentiveAmount)
  }, [currency, incentive, value])
}

export function useIncentiveList(
  amount: CurrencyAmount | undefined
): {
  min: Fraction | undefined
  suggested: Fraction | undefined
  fast: Fraction | undefined
} {
  return useMemo(() => {
    if (!amount || !amount.greaterThan('0'))
      return {
        min: undefined,
        suggested: undefined,
        fast: undefined
      }
    const min = amount.multiply(JSBI.BigInt(20)).divide(JSBI.BigInt(1000))
    const suggested = amount.multiply(JSBI.BigInt(30)).divide(JSBI.BigInt(1000))
    const fast = amount.multiply(JSBI.BigInt(50)).divide(JSBI.BigInt(1000))

    return {
      min,
      suggested,
      fast
    }
  }, [amount])
}
