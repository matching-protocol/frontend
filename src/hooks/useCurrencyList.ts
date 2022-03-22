import { Token } from 'constants/token'
import { useMemo } from 'react'
import currencyList from '../data/currencyList.json'

const list: {
  symbol: string
  address: string
  chainId: number
  name: string
  decimals: number
  logo: string
}[] = currencyList

export function useLocalCurrency1(address: string | undefined) {
  return useMemo(() => {
    if (!list || !address) return undefined
    for (const item of list) {
      if (item.address === address) {
        return new Token(item.chainId, item.address, item.decimals, item.symbol, item.name, item.logo)
      }
    }
    return undefined
  }, [address])
}

export default list
