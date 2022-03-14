import { ChainId } from 'constants/chain'
import { ETHER, Token } from 'constants/token'
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

export function useCurrencyListByChain(chain: number | ChainId | null | undefined) {
  return useMemo(
    () =>
      list
        .filter(item => item.chainId === chain)
        .map(item => {
          if (item.address) {
            return new Token(item.chainId, item.address, item.decimals, item.symbol, item.name, item.logo)
          } else {
            return ETHER
          }
        }),
    [chain]
  )
}

export function useLocalCurrency(chainId: number | undefined, address: string | undefined) {
  const list = useCurrencyListByChain(chainId)
  return useMemo(() => {
    if (!list || !chainId || !address) return undefined
    for (const item of list) {
      if (item instanceof Token && address.toUpperCase() === item.address.toUpperCase()) {
        return item
      }
    }
    return undefined
  }, [address, chainId, list])
}

export function getLocalToken(chainId: number, address: string) {
  for (const item of list) {
    if (item.chainId !== chainId) continue
    if (item.address === address) {
      return new Token(item.chainId, item.address, item.decimals, item.symbol, item.name, item.logo)
    }
  }
  return undefined
}

export default list
