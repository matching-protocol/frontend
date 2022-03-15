import { Box, Typography } from '@mui/material'
import OutlineButton from 'components/Button/OutlineButton'
import StatusTag from 'components/StatusTag'
import { getDeltaTime, Timer } from 'components/Timer'
import { routes } from 'constants/routes'
import { OrderInfo, OrderStatus } from 'hooks/useFetchOrderList'
import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'

export default function TakeStatus({ order }: { order: OrderInfo }) {
  const history = useHistory()
  const toTake = useCallback(() => history.push(routes.takeOffer + `/${order.global_order_id}`), [
    history,
    order.global_order_id
  ])

  switch (order.status) {
    case OrderStatus.Order_ForTaking:
      return (
        <OutlineButton height="32px" fontSize={13} onClick={toTake} primary>
          Take Offer
        </OutlineButton>
      )
    case OrderStatus.Order_Received:
      return <StatusTag key={1} type="complete" />
    case OrderStatus.Order_Taken:
      if (getDeltaTime(order.Deadline)) {
        return (
          <OutlineButton key={1} width="124px" height="44px" fontSize={13} borderRadius="57px" primary>
            <Box onClick={toTake}>
              <Typography fontSize={13}>Execute Fund</Typography>
              <Typography fontSize={11} sx={{ opacity: 0.5 }}>
                Closes in <Timer onlyNumber timer={order.Deadline} onZero={() => {}} />
              </Typography>
            </Box>
          </OutlineButton>
        )
      } else {
        return (
          <OutlineButton height="32px" fontSize={13} onClick={toTake} primary>
            Take Offer
          </OutlineButton>
        )
      }
    default:
      return null
  }
}
