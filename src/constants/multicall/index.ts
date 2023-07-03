import MULTICALL_ABI from './abi.json'
import { ChainId } from '../chain'

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
  [ChainId.SEPOLIA]: '0xE78D911B56a6321bF622172D32D916f9563e8D84',
  [ChainId.BSCTEST]: '0x1b37e704388e2f544c62177173e62ac46ce0b9e7'
}

export { MULTICALL_ABI, MULTICALL_NETWORKS }
