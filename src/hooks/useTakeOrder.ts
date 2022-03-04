import { useCallback } from 'react'
import { useActiveWeb3React } from '.'
import { takeOrder } from 'utils/fetch/order'
import { calculateGasMargin } from 'utils'
import { useMatchingContract } from './useContract'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from 'state/transactions/hooks'

export function useTakeOrderCallback() {
  const { account } = useActiveWeb3React()
  const contract = useMatchingContract()
  const addTransaction = useTransactionAdder()

  const takeCallback = useCallback(
    (args: any[]) => {
      console.log('🚀 ~ file: useTakeOrder.ts ~ line 16 ~ useTakeOrderCallback ~ args', args)
      if (!contract || !account) return
      // args = [
      //   [
      //     [97, 0],
      //     '0x18041866663b077bB6BF2bAFFAeA2451a2472ed7',
      //     '0x18041866663b077bB6BF2bAFFAeA2451a2472ed7',
      //     '0x18041866663b077bB6BF2bAFFAeA2451a2472ed7',
      //     '0xfE1e3D33305a88bEaE7EEE1590Ef025b8117E5D7',
      //     '0x919BE0D40f5fc42E3CBf7A7F6454D9D33C82091d',
      //     5,
      //     3601646306511,
      //     '1000000000000000000',
      //     '20000000000000000',
      //     1
      //   ],
      //   '0xccf167e235124af3fdc8a590724a1142f8b2b1fcd4bc46be2b633d35d0c2407b5bd66940cee5d3d9db21cbc8a3e7702f5a9b88f7e6ffc7127b33c2b6ec2fcbba01'
      // ]
      return contract.estimateGas.takeOrder(...args, { from: account }).then(estimatedGasLimit => {
        return contract
          .takeOrder(...args, {
            gasLimit: calculateGasMargin(estimatedGasLimit),
            // gasLimit: '3500000',
            from: account
          })
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: 'Take Order'
            })
            return response.hash
          })
      })
    },
    [account, addTransaction, contract]
  )

  const getTakeSign = useCallback(
    async (orderId: number | string) => {
      if (!account) return undefined
      try {
        const res: any = await takeOrder(orderId, account)
        const resData = res.data.data
        return [
          [
            [resData.ChainId, resData.OrderIdOnChain],
            resData.ToChain,
            resData.Sender,
            resData.Receiver,
            resData.Taker,
            resData.FromToken,
            resData.ReceiveToken,
            resData.Nonce,
            resData.Deadline,
            resData.Amount,
            resData.Incentive,
            resData.Status
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
    getTakeSign,
    takeCallback
  }
}
