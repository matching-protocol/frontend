import { Chain } from 'models/chain'
import { ReactComponent as ETH } from 'assets/svg/eth_logo.svg'
import { ReactComponent as BSC } from 'assets/svg/binance.svg'
import EthUrl from 'assets/svg/eth_logo.svg'
import BSCUrl from 'assets/svg/binance.svg'

export enum ChainId {
  MAINNET = 1,
  SEPOLIA = 11155111,
  BSCTEST = 97
  // BSC = 56
}

export const ChainList = [
  // {
  //   icon: <ETH />,
  //   logo: EthUrl,
  //   symbol: 'Ropsten',
  //   name: 'Ropsten Test Network',
  //   id: ChainId.ROPSTEN,
  //   hex: '0x3'
  // },
  {
    icon: <ETH />,
    logo: EthUrl,
    symbol: 'Sepolia',
    name: 'Sepolia Testnet',
    id: ChainId.SEPOLIA,
    hex: '0xaa36a7'
  },
  {
    icon: <BSC />,
    logo: BSCUrl,
    symbol: 'BSCTEST',
    name: 'Binance Testnet',
    id: ChainId.BSCTEST,
    hex: '0x61'
  }
  // {
  //   icon: <BSCInvert height={20} width={20} />,
  //   logo: BSCUrl,
  //   symbol: 'BSC',
  //   name: 'Binance Smart Chain',
  //   id: ChainId.BSC,
  //   hex: '0x38'
  // }
]

export const ChainListMap: {
  [key: number]: { icon: JSX.Element; link?: string; selectedIcon?: JSX.Element } & Chain
} = ChainList.reduce((acc, item) => {
  acc[item.id] = item
  return acc
}, {} as any)

export const SUPPORTED_NETWORKS: {
  [chainId in ChainId]?: {
    chainId: string
    chainName: string
    nativeCurrency: {
      name: string
      symbol: string
      decimals: number
      logo: string
    }
    rpcUrls: string[]
    blockExplorerUrls: string[]
  }
} = {
  [ChainId.MAINNET]: {
    chainId: '0x1',
    chainName: 'Ethereum',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
      logo: EthUrl
    },
    rpcUrls: ['https://mainnet.infura.io/v3'],
    blockExplorerUrls: ['https://etherscan.com']
  },
  [ChainId.SEPOLIA]: {
    chainId: '0xaa36a7',
    chainName: 'Sepolia',
    nativeCurrency: {
      name: 'Sepolia Testnet',
      symbol: 'ETH',
      decimals: 18,
      logo: EthUrl
    },
    rpcUrls: ['https://sepolia.infura.io/v3/169a2f10743f4afdaa0a17e148552867'],
    blockExplorerUrls: ['https://sepolia.etherscan.io/']
  },
  [ChainId.BSCTEST]: {
    chainId: '0x61',
    chainName: 'Binance TEST Chain',
    nativeCurrency: {
      name: 'Binance Coin',
      symbol: 'BNB',
      decimals: 18,
      logo: BSCUrl
    },
    rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
    blockExplorerUrls: ['https://testnet.bscscan.com/']
  }
  // [ChainId.BSC]: {
  //   chainId: '0x38',
  //   chainName: 'Binance Smart Chain',
  //   nativeCurrency: {
  //     name: 'Binance Coin',
  //     symbol: 'BNB',
  //     decimals: 18
  //   },
  //   rpcUrls: ['https://bsc-dataseed.binance.org'],
  //   blockExplorerUrls: ['https://bscscan.com']
  // }
}
