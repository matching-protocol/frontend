import { useActiveWeb3React } from 'hooks'
import { useEffect, useState } from 'react'
import { getOrderById, getOrders, getAccountOrderList, AccountOrderStatus, AccountOrderRole } from 'utils/fetch/order'

export enum OrderStatus {
  Order_Unstarted,
  Order_ForTaking,
  Order_Taken,
  Order_Received,
  Order_Withdrawed,
  Order_Outdated,
  Order_Any
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

function calcPageTotal(total: number, pageSize: number) {
  return Math.ceil(total / pageSize)
}

export function useOrderList(orderStatus: OrderStatus) {
  const [list, setList] = useState<OrderInfo[]>([])
  const pageSize = 10
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    setPage(1)
  }, [orderStatus])

  useEffect(() => {
    ;(async () => {
      try {
        setIsLoading(true)
        setList([])
        const res: any = await getOrders(orderStatus, page, pageSize)
        const data = res.data
        setList(data.orders)
        setTotalPages(calcPageTotal(data.total, pageSize))
      } catch (error) {
        setList([])
        console.error('fetch useOrderList', error)
      }
      setTimeout(() => setIndex(index + 1), 10000)
      setIsLoading(false)
    })()
  }, [index, orderStatus, page])

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
        setList(data.orders)
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
