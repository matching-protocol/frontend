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

export function useLocalCurrency(address: string | undefined) {
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

export function getLocalToken(chainId: number, address: string) {
  for (const item of list) {
    if (item.chainId !== chainId) continue
    if (item.address === address) {
      return new Token(item.chainId, item.address, item.decimals, item.symbol, item.name, item.logo)
    }
  }
  return undefined
}

export function useLocalTokenSymbolList() {
  return useMemo(() => {
    const ret: Token[] = []
    const has: string[] = []
    for (const item of list) {
      if (has.includes(item.symbol)) continue
      ret.push(new Token(item.chainId, item.address, item.decimals, item.symbol, item.name, item.logo))
      has.push(item.symbol)
    }
    return ret
  }, [])
}

export default list
