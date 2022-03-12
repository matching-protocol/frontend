import { OrderInfo, OrderStatus } from 'hooks/useFetch'
import { useTakeOrderCallback } from 'hooks/useTakeOrder'
import { useActiveWeb3React } from 'hooks'
import { useCallback, useMemo, useState } from 'react'
import Button from 'components/Button/Button'
import { useWalletModalToggle } from 'state/application/hooks'
import { triggerSwitchChain } from 'utils/triggerSwitchChain'
import { useLocalCurrency } from 'hooks/useCurrencyList'
import { useTokenBalance } from 'state/wallet/hooks'
import { TokenAmount } from 'constants/token'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { MATCHING_ADDRESS } from '../../constants'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import TransactionPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import useModal from 'hooks/useModal'
import { ChainListMap } from 'constants/chain'
import { Dots } from 'theme/components'

export function OrderTakeSign({ order, next }: { order: OrderInfo; next: () => void }) {
  const { account, library, chainId } = useActiveWeb3React()
  const { getTakeSign } = useTakeOrderCallback()
  const toggleWalletModal = useWalletModalToggle()
  const { showModal } = useModal()
  const [request, setRequest] = useState(false)

  const payToken = useLocalCurrency(order.to_chain_id, order.receive_token_address)

  const payBalance = useMemo(() => {
    if (!payToken) {
      return undefined
    }
    return new TokenAmount(payToken, order.amount)
  }, [order.amount, payToken])

  const balance = useTokenBalance(account || undefined, payToken)

  const onTake = useCallback(
    async (orderId: string | number) => {
      try {
        setRequest(true)
        const data = await getTakeSign(orderId)
        if (!data) {
          showModal(<MessageBox type="error">get sign error</MessageBox>)
          return
        }
        setTimeout(() => next(), 500)
      } catch (error) {
        console.error(error)
        showModal(<MessageBox type="error">get sign error</MessageBox>)
      }
      setRequest(false)
    },
    [getTakeSign, next, showModal]
  )

  const payStatus = useMemo(() => {
    if (!account || !library) {
      return {
        msg: 'Connect wallet',
        event: toggleWalletModal
      }
    }

    if (chainId !== order.to_chain_id) {
      return {
        msg: `Switch to ${ChainListMap[order.to_chain_id].symbol}`,
        event: () => order.to_chain_id && triggerSwitchChain(library, order.to_chain_id, account)
      }
    }

    if (!balance || !payBalance || balance.lessThan(payBalance)) {
      return {
        msg: 'Balance Insufficient',
        event: undefined
      }
    }

    if (OrderStatus.Order_Taken === order.status && account === order.taker) {
      return {
        msg: 'Continue',
        event: () => next()
      }
    }
    return {
      msg: 'Take Offer',
      event: () => onTake(order.global_order_id)
    }
  }, [
    account,
    balance,
    chainId,
    library,
    next,
    onTake,
    order.global_order_id,
    order.status,
    order.taker,
    order.to_chain_id,
    payBalance,
    toggleWalletModal
  ])

  const action = useMemo(() => {
    switch (order.status) {
      case OrderStatus.Order_ForTaking:
        // if (account === order.sender) {
        //   return {
        //     msg: 'Cancel',
        //     event: undefined
        //   }
        // } else {
        return payStatus
      // }
      case OrderStatus.Order_Taken:
        if (account === order.taker) {
          return payStatus
        } else {
          return {
            msg: 'Ordering',
            event: undefined
          }
        }

      default:
        return {
          msg: 'Completed',
          event: undefined
        }
    }
  }, [order.status, order.taker, payStatus, account])

  return (
    <>
      {!request ? (
        <Button
          borderRadius="16px"
          disabled={action.event === undefined}
          height="60px"
          width={'100%'}
          fontSize={13}
          onClick={action.event}
        >
          {action.msg}
        </Button>
      ) : (
        <Button borderRadius="16px" disabled={true} height="60px" width={'100%'} fontSize={13}>
          Take Offer
          <Dots />
        </Button>
      )}
    </>
  )
}

export function OrderDetailOperate({ order, again }: { order: OrderInfo; again?: boolean }) {
  const { account, library, chainId } = useActiveWeb3React()
  const { getTakeSign, takeCallback } = useTakeOrderCallback()
  const toggleWalletModal = useWalletModalToggle()
  const { showModal, hideModal } = useModal()

  // const receiveToken = useLocalCurrency(order.chain_id, order.token_address)
  const payToken = useLocalCurrency(order.to_chain_id, order.receive_token_address)

  const payBalance = useMemo(() => {
    if (!payToken) {
      return undefined
    }
    return new TokenAmount(payToken, order.amount)
  }, [order.amount, payToken])

  const balance = useTokenBalance(account || undefined, payToken)

  const onTake = useCallback(
    async (orderId: string | number) => {
      const data = await getTakeSign(orderId)
      if (!data) {
        showModal(<MessageBox type="error">get sign error</MessageBox>)
        return
      }
      showModal(<TransactionPendingModal />)
      takeCallback(data)
        .then(() => {
          hideModal()
          showModal(<TransactionSubmittedModal />)
        })
        .catch((err: any) => {
          hideModal()
          showModal(
            <MessageBox type="error">{err.error && err.error.message ? err.error.message : err?.message}</MessageBox>
          )
          console.error(err)
        })
    },
    [getTakeSign, hideModal, showModal, takeCallback]
  )

  const [approvalState, approvalCallback] = useApproveCallback(
    payBalance,
    chainId ? MATCHING_ADDRESS[chainId] : undefined
  )

  const payStatus = useMemo(() => {
    if (!account || !library) {
      return {
        msg: 'Connect wallet',
        event: toggleWalletModal
      }
    }

    if (chainId !== order.to_chain_id) {
      return {
        msg: 'Switch',
        event: () => order.to_chain_id && triggerSwitchChain(library, order.to_chain_id, account)
      }
    }

    if (!balance || !payBalance || balance.lessThan(payBalance)) {
      return {
        msg: 'Balance Insufficient',
        event: undefined
      }
    }

    if (approvalState !== ApprovalState.APPROVED) {
      if (approvalState === ApprovalState.PENDING) {
        return {
          msg: 'Approving...',
          event: toggleWalletModal
        }
      } else if (approvalState === ApprovalState.NOT_APPROVED) {
        return {
          msg: 'Approval',
          event: approvalCallback
        }
      } else {
        return {
          msg: 'Loading',
          event: undefined
        }
      }
    }

    return {
      msg: again ? 'Try Again' : 'Take Offer',
      event: () => onTake(order.global_order_id)
    }
  }, [
    again,
    account,
    approvalCallback,
    approvalState,
    balance,
    chainId,
    library,
    onTake,
    order.global_order_id,
    order.to_chain_id,
    payBalance,
    toggleWalletModal
  ])

  const action = useMemo(() => {
    switch (order.status) {
      case OrderStatus.Order_ForTaking:
        // if (account === order.sender) {
        //   return {
        //     msg: 'Cancel',
        //     event: undefined
        //   }
        // } else {
        return payStatus
      // }
      case OrderStatus.Order_Taken:
        if (account === order.taker) {
          return payStatus
        } else {
          return {
            msg: 'Ordering',
            event: undefined
          }
        }

      default:
        return {
          msg: 'Completed',
          event: undefined
        }
    }
  }, [order.status, order.taker, payStatus, account])

  return (
    <>
      {action.msg && (
        <Button disabled={action.event === undefined} height="60px" width={'100%'} fontSize={13} onClick={action.event}>
          {action.msg}
        </Button>
      )}
    </>
  )
}
