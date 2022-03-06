import { useEffect, useState } from 'react'
import { getOrders } from 'utils/fetch/order'

export enum OrderStatus {
  Order_Unstarted,
  Order_Open,
  Order_Taken,
  Order_Finished,
  Order_Withdrawed,
  Order_Outdated
}

export interface OrderInfo {
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
  to_chain_id: number
  token_address: string
  tx_hash: string
}

function calcPageTotal(total: number, pageSize: number) {
  return Math.ceil(total / pageSize)
}

export function useOrderList(orderStatus: OrderStatus) {
  const [list, setList] = useState<OrderInfo[]>([])
  const pageSize = 3
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(0)

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
      setIsLoading(false)
    })()
  }, [orderStatus, page])

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
