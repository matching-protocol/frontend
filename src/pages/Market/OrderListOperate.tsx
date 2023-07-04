import { useActiveWeb3React } from 'hooks'
import { routes } from 'constants/routes'
import { OrderInfo, OrderStatus } from 'hooks/useFetchOrderList'
import { useCallback, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import Button from 'components/Button/Button'

export default function OrderListOperate({ width, order }: { width: string; order: OrderInfo }) {
  const { account } = useActiveWeb3React()
  const history = useHistory()
  const onTakeOffer = useCallback(
    (orderId: string | number) => {
      history.push(routes.takeOffer + `/${orderId}`)
    },
    [history]
  )

  const action = useMemo(() => {
    switch (order.status) {
      case OrderStatus.Status_wait:
        // if (account === order.sender) {
        //   return {
        //     msg: 'Cancel',
        //     event: undefined
        //   }
        // } else {
        return {
          msg: 'Take Offer',
          event: () => onTakeOffer(order.global_order_id)
        }
      // }
      case OrderStatus.Status_taking:
        if (account === order.taker) {
          return {
            msg: 'Continue',
            event: () => onTakeOffer(order.global_order_id)
          }
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
  }, [account, onTakeOffer, order.global_order_id, order.status, order.taker])

  return (
    <>
      {action.msg && (
        <Button
          disabled={action.event === undefined}
          style={{ fontWeight: 400 }}
          height="32px"
          width={width}
          fontSize={13}
          onClick={action.event}
        >
          {action.msg}
        </Button>
      )}
    </>
  )
}
