import { useCallback } from 'react'
import { useActiveWeb3React } from '.'
import { getAccountWithdrawAllSign } from 'utils/fetch/order'
import { calculateGasMargin } from 'utils'
import { useMatchingContract } from './useContract'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useSignMessage } from './useWeb3Instance'

export function useWalletWithdrawCallback() {
  const { account, chainId } = useActiveWeb3React()
  const contract = useMatchingContract()
  const addTransaction = useTransactionAdder()

  const withdrawCallback = useCallback(
    (args: any[], key: string) => {
      console.log('🚀 ~ file: useWalletWithdraw.ts ~ line 16 ~ useWalletWithdrawCallback ~ args', args)
      if (!contract || !account) throw new Error('none contract or account')

      return contract.estimateGas.withdrawall(...args, { from: account }).then(estimatedGasLimit => {
        return contract
          .withdrawall(...args, {
            gasLimit: calculateGasMargin(estimatedGasLimit),
            // gasLimit: '3500000',
            from: account
          })
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: 'Withdraw token',
              tag: {
                type: 'withdraw',
                key
              }
            })
            return response.hash
          })
      })
    },
    [account, addTransaction, contract]
  )
  const signMessage = useSignMessage()

  const getWithdrawSign = useCallback(
    async (tokenAddress: string) => {
      if (!account || !chainId) return undefined
      try {
        const message = 'Withdraw token signature.'
        const signature = await signMessage(message)
        const res: any = await getAccountWithdrawAllSign(account, chainId, tokenAddress, message, signature)
        const resData = res.data.data.data
        return [
          [resData.ChainId, resData.Taker, resData.Token, resData.Nonce, resData.TotalAmount, resData.Status],
          res.data.data.signature
        ]
      } catch (error) {
        throw error
      }
    },
    [account, chainId, signMessage]
  )

  return {
    getWithdrawSign,
    withdrawCallback
  }
}
