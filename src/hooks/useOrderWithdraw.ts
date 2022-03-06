import { useCallback } from 'react'
import { useActiveWeb3React } from '.'
import { withdrawOrder } from 'utils/fetch/order'
import { calculateGasMargin } from 'utils'
import { useMatchingContract } from './useContract'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from 'state/transactions/hooks'

export function useOrderWithdraw() {
  const { account } = useActiveWeb3React()
  const contract = useMatchingContract()
  const addTransaction = useTransactionAdder()

  const withdrawCallback = useCallback(
    (args: any[]) => {
      console.log('🚀 ~ file: useTakeOrder.ts ~ line 16 ~ useTakeOrderCallback ~ args', args)
      if (!contract || !account) throw new Error('none contract or account')

      return contract.estimateGas.withdraw(...args, { from: account }).then(estimatedGasLimit => {
        return contract
          .withdraw(...args, {
            gasLimit: calculateGasMargin(estimatedGasLimit),
            // gasLimit: '3500000',
            from: account
          })
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: 'withdraw Order'
            })
            return response.hash
          })
      })
    },
    [account, addTransaction, contract]
  )

  const getWithdrawSign = useCallback(
    async (orderId: number | string) => {
      if (!account) return undefined
      try {
        const res: any = await withdrawOrder(orderId, account)
        const resData = res.data.data
        return [
          [
            [resData.ChainId, resData.OrderIdOnChain],
            resData.Taker,
            resData.Token,
            resData.Receiver,
            resData.Nonce,
            resData.Deadline,
            resData.Amount,
            resData.Incentive
          ],
          res.data.signature
        ]
      } catch (error) {
        return undefined
      }
    },
    [account]
  )

  return {
    withdrawCallback,
    getWithdrawSign
  }
}
