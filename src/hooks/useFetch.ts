import { ChainId } from 'constants/chain'
import { Currency, CurrencyAmount, Token, TokenAmount } from 'constants/token'
import { BigintIsh } from 'constants/token/constants'
import { useActiveWeb3React } from 'hooks'
import { useEffect, useState } from 'react'
import { getLocalToken } from 'state/token/hooks'
import {
  getOrderById,
  getAccountOrderList,
  AccountOrderStatus,
  AccountOrderRole,
  getAccountWalletInformation,
  getAccountWithdrawList
} from 'utils/fetch/order'
import { calcPageTotal, OrderInfo } from './useFetchOrderList'

export function useOrderById(orderId: string | number, reRequest?: any) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [result, setResult] = useState<OrderInfo>()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    ;(async () => {
      try {
        setIsLoading(true)
        const res: any = await getOrderById(orderId)
        const data = res.data
        setResult(data.order)
      } catch (error) {
        setResult(undefined)
        console.error('fetch useOrderById', error)
      }
      setIsLoading(false)
      setTimeout(() => setIndex(index + 1), 5000)
    })()
  }, [orderId, index, reRequest])

  return {
    loading: isLoading,
    result
  }
}

export function useAccountOrderList(status: AccountOrderStatus, role: AccountOrderRole) {
  const [list, setList] = useState<OrderInfo[]>([])
  const pageSize = 10
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(0)
  const { account } = useActiveWeb3React()

  useEffect(() => {
    setPage(1)
  }, [status, role])

  useEffect(() => {
    ;(async () => {
      if (!account) {
        setList([])
        return
      }
      try {
        setIsLoading(true)
        setList([])
        const res: any = await getAccountOrderList(account, status, role, page, pageSize)
        const data = res.data
        setList(data.data.orders)
        setTotalPages(calcPageTotal(data.total, pageSize))
      } catch (error) {
        setList([])
        console.error('fetch useAccountOrderList', error)
      }
      setIsLoading(false)
    })()
  }, [account, page, role, status])

  return {
    page: {
      page,
      setPage,
      totalPages
    },
    loading: isLoading,
    list
  }
}

export function useAccountWalletInformation(chainId: ChainId) {
  const { account } = useActiveWeb3React()
  const [list, setList] = useState<
    {
      currency: Currency | undefined
      currencyAmount: CurrencyAmount | TokenAmount | undefined
    }[]
  >([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    ;(async () => {
      if (!account) {
        setList([])
        return
      }
      try {
        setIsLoading(true)
        setList([])
        const res: any = await getAccountWalletInformation(account, chainId)
        const data = res.data
        const _list = data.tokens.map((item: { TokenAddr: string; Amount: BigintIsh }) => {
          const _token = getLocalToken(chainId, item.TokenAddr)
          if (!_token)
            return {
              currency: undefined,
              currencyAmount: undefined
            }
          if (_token instanceof Token) {
            return {
              currency: _token,
              currencyAmount: new TokenAmount(_token, item.Amount)
            }
          }
          return {
            currency: _token,
            currencyAmount: CurrencyAmount.getEther(_token, item.Amount)
          }
        })
        setList(_list)
      } catch (error) {
        setList([])
        console.error('fetch useAccountWalletInformation', error)
      }
      setIsLoading(false)
    })()
  }, [account, chainId])

  return {
    loading: isLoading,
    list
  }
}

export enum AccountWithdrawStatus {
  pending = 1,
  complete = 2
}
export interface AccountWithdrawProp {
  createdAt: number
  status: AccountWithdrawStatus
  hash: string
  currency: Currency | undefined
  currencyAmount: TokenAmount | CurrencyAmount | undefined
}

export function useAccountWithdrawList(chainId: ChainId) {
  const [list, setList] = useState<AccountWithdrawProp[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { account } = useActiveWeb3React()

  const pageSize = 10
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(0)

  useEffect(() => {
    setPage(1)
  }, [account, chainId])

  useEffect(() => {
    ;(async () => {
      if (!account) {
        setList([])
        return
      }
      try {
        setIsLoading(true)
        setList([])
        const res: any = await getAccountWithdrawList(account, chainId, page)
        const data = res.data
        const _list: AccountWithdrawProp[] = data.withdrawed.map((item: any) => {
          const _token = getLocalToken(chainId, item.TokenAddr)
          let _currencyAmount = undefined
          if (_token) {
            if (_token instanceof Token) {
              _currencyAmount = new TokenAmount(_token, item.Amount)
            } else {
              _currencyAmount = CurrencyAmount.getEther(_token, item.Amount)
            }
          }
          return {
            currencyAmount: _currencyAmount,
            currency: _token,
            createdAt: item.CreatedAt,
            status: item.Status,
            hash: item.TxHash
          }
        })
        setList(_list)
        setTotalPages(calcPageTotal(data.total, pageSize))
      } catch (error) {
        setList([])
        console.error('fetch useAccountWithdrawList', error)
      }
      setIsLoading(false)
    })()
  }, [account, chainId, page])

  return {
    page: {
      page,
      setPage,
      totalPages
    },
    loading: isLoading,
    list
  }
}
