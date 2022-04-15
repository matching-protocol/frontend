import { ChainId, SUPPORTED_NETWORKS } from 'constants/chain'
import JSBI from 'jsbi'
import { SolidityType } from './constants'
import { validateSolidityTypeInstance } from './utils'

/**
 * A currency is any fungible financial instrument on Ethereum, including Ether and all ERC20 tokens.
 *
 * The only instance of the base class `Currency` is Ether.
 */
export class Currency {
  public readonly decimals: number
  public readonly symbol?: string
  public readonly name?: string
  public readonly logo?: string
  public readonly address: string
  public readonly chainId?: number
  public readonly platformId?: number

  /**
   * The only instance of the base class `Currency`.
   */
  public static readonly ETHER: Currency = new Currency(18, 'HT', 'Ether')

  public static getETHCurrency(chainId: ChainId, platformId?: number) {
    const chain = SUPPORTED_NETWORKS[chainId]
    if (!chain) return undefined
    return new Currency(
      chain.nativeCurrency.decimals,
      chain.nativeCurrency.symbol,
      chain.nativeCurrency.name,
      chain.nativeCurrency.logo,
      platformId
    )
  }

  /**
   * Constructs an instance of the base class `Currency`. The only instance of the base class `Currency` is `Currency.ETHER`.
   * @param decimals decimals of the currency
   * @param symbol symbol of the currency
   * @param name of the currency
   */
  protected constructor(
    decimals: number,
    symbol?: string,
    name?: string,
    logo?: string,
    chainId?: number,
    platformId?: number
  ) {
    validateSolidityTypeInstance(JSBI.BigInt(decimals), SolidityType.uint8)

    this.decimals = decimals
    this.symbol = symbol
    this.name = name
    this.logo = logo
    this.chainId = chainId
    this.address = ''
    this.platformId = platformId
  }
}

const ETHER = Currency.ETHER
export { ETHER }
