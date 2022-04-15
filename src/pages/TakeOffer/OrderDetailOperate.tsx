import { OrderInfo, OrderStatus } from 'hooks/useFetchOrderList'
import { useTakeOrderCallback } from 'hooks/useTakeOrder'
import { useActiveWeb3React } from 'hooks'
import { useCallback, useMemo, useState } from 'react'
import Button from 'components/Button/Button'
import { useWalletModalToggle } from 'state/application/hooks'
import { triggerSwitchChain } from 'utils/triggerSwitchChain'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { CurrencyAmount, ETHER, Token, TokenAmount } from 'constants/token'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { MATCHING_ADDRESS } from '../../constants'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import TransactionPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import useModal from 'hooks/useModal'
import { ChainListMap } from 'constants/chain'
import { Dots } from 'theme/components'
import { useTagCompletedTx } from 'state/transactions/hooks'
import { useLocalCurrency } from 'state/token/hooks'

export function OrderTakeSign({ order, next }: { order: OrderInfo; next: () => void }) {
  const { account, library, chainId } = useActiveWeb3React()
  const { getTakeSign } = useTakeOrderCallback()
  const toggleWalletModal = useWalletModalToggle()
  const { showModal } = useModal()
  const [request, setRequest] = useState(false)

  const payCurrency = useLocalCurrency(order.to_chain_id, order.receive_token_address)

  const payBalance = useMemo(() => {
    if (!payCurrency || !order?.amount) return undefined
    if (payCurrency instanceof Token) return new TokenAmount(payCurrency, order.amount)
    else return CurrencyAmount.getEther(payCurrency, order.amount)
  }, [order.amount, payCurrency])

  const truePayCurrency = useMemo(() => {
    if (payCurrency instanceof Token) return payCurrency
    return ETHER
  }, [payCurrency])

  const balance = useCurrencyBalance(account || undefined, truePayCurrency)

  const onTake = useCallback(
    async (orderId: string | number) => {
      try {
        setRequest(true)
        const data = await getTakeSign(orderId)
        if (!data) {
          showModal(<MessageBox type="error">get sign error</MessageBox>)
          return
        }
        next()
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
        msg: `Switch to ${ChainListMap[order.to_chain_id].name}`,
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
      msg: 'Confirm',
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

  const action: {
    msg: string | JSX.Element
    event: (() => void) | undefined
  } = useMemo(() => {
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

export function OrderDetailOperate({ order, again, next }: { order: OrderInfo; again?: boolean; next: () => void }) {
  const { account, library, chainId } = useActiveWeb3React()
  const { getTakeSign, takeCallback } = useTakeOrderCallback()
  const toggleWalletModal = useWalletModalToggle()
  const { showModal, hideModal } = useModal()

  const payCurrency = useLocalCurrency(order.to_chain_id, order.receive_token_address)

  const payBalance = useMemo(() => {
    if (!payCurrency || !order?.amount) return undefined
    if (payCurrency instanceof Token) return new TokenAmount(payCurrency, order.amount)
    else return CurrencyAmount.getEther(payCurrency, order.amount)
  }, [order.amount, payCurrency])

  const truePayCurrency = useMemo(() => {
    if (payCurrency instanceof Token) return payCurrency
    return ETHER
  }, [payCurrency])

  const balance = useCurrencyBalance(account || undefined, truePayCurrency)

  const isCompleted = useTagCompletedTx('take', order.global_order_id.toString())

  const onTake = useCallback(
    async (orderId: string | number) => {
      showModal(<TransactionPendingModal />)
      const data = await getTakeSign(orderId)
      if (!data) {
        showModal(<MessageBox type="error">get sign error</MessageBox>)
        return
      }
      next()
      takeCallback(data, order.global_order_id.toString())
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
    [getTakeSign, hideModal, next, order.global_order_id, showModal, takeCallback]
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
        msg: 'Switch to ' + ChainListMap[order.to_chain_id].name,
        event: () => order.to_chain_id && triggerSwitchChain(library, order.to_chain_id, account)
      }
    }

    if (isCompleted === false) {
      return {
        msg: (
          <>
            Pending
            <Dots />
          </>
        ),
        event: undefined
      }
    }

    if (isCompleted === true) {
      return {
        msg: <>Completed</>,
        event: undefined
      }
    }

    if (!balance || !payBalance) {
      return {
        msg: 'Loading',
        event: undefined
      }
    }

    if (balance.lessThan(payBalance)) {
      return {
        msg: 'Balance Insufficient',
        event: undefined
      }
    }

    if (approvalState !== ApprovalState.APPROVED) {
      if (approvalState === ApprovalState.PENDING) {
        return {
          msg: (
            <>
              Approving
              <Dots />
            </>
          ),
          event: undefined
        }
      } else if (approvalState === ApprovalState.NOT_APPROVED) {
        return {
          msg: 'Approve',
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
      msg: again || !order.taker ? 'Try Again' : 'Send',
      event: () => onTake(order.global_order_id)
    }
  }, [
    account,
    library,
    chainId,
    order.to_chain_id,
    order.taker,
    order.global_order_id,
    isCompleted,
    balance,
    payBalance,
    approvalState,
    again,
    toggleWalletModal,
    approvalCallback,
    onTake
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
