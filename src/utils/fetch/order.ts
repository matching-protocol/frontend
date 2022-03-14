import { OrderStatus } from 'hooks/useFetch'
import { Axios } from 'utils/axios'

export const getOrders = (status: OrderStatus, page: number, pagesize = 10) => {
  return Axios.get('api/v1/orders', {
    status,
    page,
    pagesize
  })
}

export const getOrderById = (orderId: string | number) => {
  return Axios.get('api/v1/order', {
    id: orderId
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

export enum AccountOrderStatus {
  OrderLive = 1,
  OrderOld = 2,
  OrderAny = 3
}
export enum AccountOrderRole {
  OrderMake = 1,
  OrderTake = 2,
  OrderParticipate = 3
}
export const getAccountOrderList = (
  account: string,
  status: AccountOrderStatus,
  role: AccountOrderRole,
  page: number,
  pagesize = 10
) => {
  return Axios.get('api/v1/accountorders', {
    account,
    status,
    role,
    page,
    pagesize
  })
}

export const getAccountWalletInformation = (account: string, chainId: number) => {
  return Axios.get('api/v1/accountwithdraws', {
    account,
    chainid: chainId
  })
}

export const getAccountWithdrawAllSign = (account: string, chainId: number, tokenAddress: string) => {
  return Axios.post(
    'api/v1/withdrawall',
    {},
    {
      taker: account,
      chainid: chainId,
      token: tokenAddress
    }
  )
}

export const getAccountWithdrawList = (account: string, chainId: number, page: number, pagesize = 10) => {
  return Axios.get('api/v1/accountwithdrawed', {
    account,
    chainid: chainId,
    page,
    pagesize
  })
}
