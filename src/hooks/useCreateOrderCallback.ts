import { calculateGasMargin } from 'utils'
import { TransactionResponse } from '@ethersproject/providers'
import { useCallback } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useActiveWeb3React } from '.'
import { useMatchingContract } from './useContract'

export function useCreateOrderCallback() {
  const addTransaction = useTransactionAdder()
  const contract = useMatchingContract()
  const { account } = useActiveWeb3React()

  return useCallback(
    (token: string, to: string, amountInt: string, incentiveInt: string, toChain: number) => {
      if (!account) throw new Error('none account')
      if (!contract) throw new Error('none contract')
      const args = [token, to, amountInt, incentiveInt, toChain]
      console.log('🚀 ~ file: useCreateOrderCallback.ts ~ line 18 ~ useCreateOrderCallback ~ args', args)

      return contract.estimateGas.createOrder(...args, { from: account }).then(estimatedGasLimit => {
        return contract
          .createOrder(...args, {
            gasLimit: calculateGasMargin(estimatedGasLimit),
            // gasLimit: '3500000',
            from: account
          })
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: 'Create Order'
            })
            return response.hash
          })
      })
    },
    [account, addTransaction, contract]
  )
}
