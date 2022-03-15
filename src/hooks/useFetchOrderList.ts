import { useCallback, useEffect, useState } from 'react'
import { getOrders } from 'utils/fetch/order'

export enum OrderStatus {
  Order_Unstarted,
  Order_ForTaking,
  Order_Taken,
  Order_Received,
  Order_Withdrawed,
  Order_Outdated,
  Order_Any
}

export enum OrderListOrderType {
  SortByDefault,
  SortByCreateTimeDesc,
  SortByMaxAmount,
  SortByMinAmount,
  SortByMaxIncentive,
  SortByMinIncentive,
  SortByMax
}

export interface OrderInfo {
  Deadline: number
  amount: string
  chain_id: number
  created_on: number
  decimal: number
  global_order_id: number
  id: number
  incentive: string
  matching_address: string
  modified_on: number
  order_id_on_chain: number
  receive_token_address: string
  receiver: string
  sender: string
  status: OrderStatus
  taker: string
  to_chain_id: number
  token_address: string
  tx_hash: string
}

export function calcPageTotal(total: number, pageSize: number) {
  return Math.ceil(total / pageSize)
}

function orderListRequestNumber(plus = false) {
  const cur = Number(window.sessionStorage.getItem('orderListRequestNumber'))
  if (plus) {
    window.sessionStorage.setItem('orderListRequestNumber', (cur + 1).toString())
    return cur + 1
  }
  return cur
}

export function useOrderList(
  orderStatus: OrderStatus,
  search: {
    fromChain: number | undefined
    toChain: number | undefined
    token: string
    id: number | string
    sortType: OrderListOrderType | undefined
  }
) {
  const [list, setList] = useState<OrderInfo[]>([])
  const pageSize = 10
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    setPage(1)
    setIsLoading(true)
  }, [orderStatus, search])

  const setPageCallback = useCallback((page: number) => {
    setIsLoading(true)
    setPage(page)
  }, [])

  useEffect(() => {
    const curRequestNumber = orderListRequestNumber(true)
    ;(async () => {
      try {
        // setIsLoading(true)
        if (isLoading) setList([])
        const res: any = await getOrders(
          orderStatus,
          page,
          pageSize,
          search.fromChain,
          search.toChain,
          search.token,
          search.id,
          search.sortType
        )
        if (curRequestNumber === orderListRequestNumber()) {
          const data = res.data
          setList(data.orders)
          setIsLoading(false)
          setTotalPages(calcPageTotal(data.total, pageSize))
        }
      } catch (error) {
        setList([])
        setIsLoading(false)
        console.error('fetch useOrderList', error)
      }
      setTimeout(() => setIndex(index + 1), 10000)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, orderStatus, page, search])

  return {
    page: {
      page,
      setPage: setPageCallback,
      totalPages
    },
    loading: isLoading,
    list
  }
}
