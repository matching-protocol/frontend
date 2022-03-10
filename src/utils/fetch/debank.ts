import { Axios } from './axios'
import { ChainId } from 'constants/chain'

const { get } = Axios

const BASE_URL = 'https://openapi.debank.com/v1'

export const DEBANK_MAPPING_CHAINID: { [key in number]: string } = {
  [ChainId.MAINNET]: 'eth'
  // [ChainId.BSC]: 'bsc',
  // [ChainId.XDAI]: 'xdai',
  // [ChainId.MATIC]: 'matic',
  // [ChainId.FANTOM]: 'ftm',
  // [ChainId.OKEX]: 'okt',
  // [ChainId.HECO]: 'heco',
  // [ChainId.AVALANCHE]: 'avax',
  // [ChainId.OPTIMISTIC]: 'op',
  // [ChainId.ARBITRUM]: 'arb',
  // [ChainId.CELO]: 'celo',
  // [ChainId.MOONRIVER]: 'movr',
  // [ChainId.CRO]: 'cro',
  // [ChainId.BOBA]: 'boba'
}

export function fetchAccountTotalValue(account: string, chainId: ChainId) {
  if (!DEBANK_MAPPING_CHAINID?.[chainId]) {
    return new Promise<void>((resolve, reject) => {
      reject(undefined)
    })
  }

  return get(`${BASE_URL}/user/chain_balance`, {
    id: account,
    chain_id: DEBANK_MAPPING_CHAINID[chainId]
  })
}

// https://openapi.debank.com/v1/user/token_list?id=0x62214327CB0CB4041F84e6B7e6FeC6418af26F34&chain_id=eth&is_all=true&has_balance=true
export function fetchAccountTokenList(account: string, chainId: ChainId) {
  return get(`${BASE_URL}/user/token_list`, {
    id: account,
    chain_id: DEBANK_MAPPING_CHAINID[chainId],
    is_all: true,
    has_balance: true
  })
}
