import { ChainId, ChainList } from 'constants/chain'
import { Currency, Token } from 'constants/token'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { AppState } from 'state'
import { SourceTokenData } from './actions'
import store from '../index'
import { Chain } from 'models/chain'

function getTrueCurrencyByChainId(list: SourceTokenData[], chainId: number) {
  return list.find(item => item.chainId === chainId)
}

export function getLocalToken(chainId: number, address: string) {
  const state = store.getState()
  const tokenList = state.token.sourceTokenList
  if (!chainId) return undefined
  if (!address) {
    return Currency.getETHCurrency(chainId)
  }
  for (const topTokens of tokenList) {
    for (const token of topTokens.chains) {
      if (chainId === token.chainId && token.address.toLowerCase() === address.toLowerCase()) {
        return new Token(token.chainId, token.address, token.decimals, token.symbol, token.name, topTokens.logo)
      }
    }
  }
  return undefined
}

export function useEnableCurrencyListByTwoChains(
  fromChain: number | ChainId | null | undefined,
  toChain: number | ChainId | null | undefined
) {
  const tokenList = useSelector<AppState, AppState['token']['sourceTokenList']>(state => state.token.sourceTokenList)
  return useMemo(() => {
    if (!fromChain || !toChain)
      return {
        fromList: [],
        toList: []
      }

    const filterList = tokenList.filter(
      item => item.supportChainIds.includes(fromChain) && item.supportChainIds.includes(toChain)
    )

    function getCurrencyList(chainId: number) {
      return filterList
        .map(item => {
          const _tokenInfo = getTrueCurrencyByChainId(item.chains, chainId)
          if (!_tokenInfo || _tokenInfo.enable === false) return undefined
          if (_tokenInfo.address) {
            return new Token(
              _tokenInfo.chainId,
              _tokenInfo.address,
              _tokenInfo.decimals,
              _tokenInfo.symbol,
              _tokenInfo.name,
              item.logo
            )
          } else {
            return Currency.getETHCurrency(chainId)
          }
        })
        .filter(i => i) // remove undefined
    }

    return {
      fromList: getCurrencyList(fromChain) as Currency[],
      toList: getCurrencyList(toChain) as Currency[]
    }
  }, [fromChain, toChain, tokenList])
}

export function useTopTokenSymbolList() {
  const tokenList = useSelector<AppState, AppState['token']['sourceTokenList']>(state => state.token.sourceTokenList)

  return useMemo(() => {
    const ret: Currency[] = []
    for (const item of tokenList) {
      if (!item.chains.length) continue
      const _default = item.chains[0]
      if (_default.address) {
        ret.push(
          new Token(
            _default.chainId,
            _default.address,
            _default.decimals,
            _default.symbol,
            _default.name,
            item.logo,
            item.id
          )
        )
      } else {
        const _eth = Currency.getETHCurrency(_default.chainId, item.id)
        _eth && ret.push(_eth)
      }
    }
    return ret
  }, [tokenList])
}

export function useLocalCurrency(chainId: number | undefined, address: string | undefined) {
  const tokenList = useSelector<AppState, AppState['token']['sourceTokenList']>(state => state.token.sourceTokenList)

  return useMemo(() => {
    if (!tokenList || !chainId) return undefined
    if (!address) {
      return Currency.getETHCurrency(chainId)
    }
    for (const topTokens of tokenList) {
      for (const token of topTokens.chains) {
        if (chainId === token.chainId && token.address.toLowerCase() === address.toLowerCase()) {
          return new Token(token.chainId, token.address, token.decimals, token.symbol, token.name, topTokens.logo)
        }
      }
    }
    return undefined
  }, [address, chainId, tokenList])
}

export function useTokenSupportChain(currency: Currency | null | undefined): Chain[] {
  const tokenList = useSelector<AppState, AppState['token']['sourceTokenList']>(state => state.token.sourceTokenList)

  return useMemo(() => {
    if (!currency || !currency.platformId) return []
    const res = tokenList.find(i => i.id === currency.platformId)
    if (res) {
      return ChainList.map(i => (res.supportChainIds.includes(i.id) ? i : undefined)).filter(i => i) as Chain[]
    }
    return []
  }, [currency, tokenList])
}

export function getLocalTokenByPlatformId(chainId: number, platformId: number) {
  const state = store.getState()
  const tokenList = state.token.sourceTokenList
  if (!chainId || !platformId) return undefined
  const res = tokenList.find(i => i.id === platformId)
  if (!res || !res.supportChainIds.includes(chainId)) return undefined
  for (const token of res.chains) {
    if (token.chainId !== chainId) continue
    if (token.address) {
      return new Token(token.chainId, token.address, token.decimals, token.symbol, token.name, res.logo)
    } else {
      return Currency.getETHCurrency(chainId)
    }
  }
  return undefined
}
