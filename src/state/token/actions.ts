import { createAction } from '@reduxjs/toolkit'

export interface SourceTokenData {
  chainId: number
  name: string
  symbol: string
  address: string
  decimals: number
  enable: boolean
}
export interface SourceTokenListProp {
  id: number
  symbol: string
  logo: string
  supportChainIds: number[]
  chains: SourceTokenData[]
}

export const updateSourceTokenListData = createAction<{ sourceTokenList: SourceTokenListProp[] }>(
  'token/updateSourceTokenListData'
)
