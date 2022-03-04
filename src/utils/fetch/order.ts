import { OrderStatus } from 'hooks/useFetch'
import { Axios } from 'utils/axios'

export const getOrders = (status: OrderStatus, page: number, pagesize = 10) => {
  return Axios.get('api/v1/orders', {
    status,
    page,
    pagesize
  })
}

export const takeOrder = (orderId: number | string, account: string) => {
  return Axios.post(
    'api/v1/takeorder',
    {},
    {
      id: orderId,
      taker: account
    }
  )
}
