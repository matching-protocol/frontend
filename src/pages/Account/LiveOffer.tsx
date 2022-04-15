import { useMemo } from 'react'
import { Typography, Box } from '@mui/material'
import Card from 'components/Card'
import Table from 'components/Table'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import Pagination from 'components/Pagination'
import { AccountOrderRole, AccountOrderStatus } from 'utils/fetch/order'
import { useAccountOrderList } from 'hooks/useFetch'
import ChainLogo from 'components/ChainLogo'
import CurrencyInfo from 'pages/Market/CurrencyInfo'
import Spinner from 'components/Spinner'
import NoData from 'components/NoData'
import JSBI from 'jsbi'

export const LiveOfferHeader = ['Order ID', 'Route', 'Currency', 'Offer Incentive', '']

export default function LiveOffer() {
  const { page: liveOfferPage, list: liveOfferList, loading: liveOfferLoading } = useAccountOrderList(
    AccountOrderStatus.OrderLive,
    AccountOrderRole.OrderMake
  )

  const liveOfferDataRows = useMemo(
    () =>
      liveOfferList.map(item => [
        <Typography key={1} fontSize={16} fontWeight={500}>
          #{item.global_order_id}
        </Typography>,
        <Box key={1} display="flex" alignItems="center" gap={12}>
          <ChainLogo widthEllipsis="60px" chainId={item.chain_id} size={'32px'} />
          <ArrowForwardIcon />
          <ChainLogo widthEllipsis="60px" chainId={item.to_chain_id} size={'32px'} />
        </Box>,
        <Box key={1} display="flex" alignItems="center" gap={12}>
          <CurrencyInfo
            key={0}
            chainId={item.chain_id}
            amount={JSBI.add(JSBI.BigInt(item.amount), JSBI.BigInt(item.incentive)).toString()}
            address={item.token_address}
            currencySize={'32px'}
            textSize={16}
            subTextSize={13}
          />
          <ArrowForwardIcon />
          <CurrencyInfo
            key={0}
            chainId={item.to_chain_id}
            address={item.receive_token_address}
            amount={item.amount}
            currencySize={'32px'}
            textSize={16}
            subTextSize={13}
          />
        </Box>,
        <CurrencyInfo
          key={0}
          chainId={item.chain_id}
          address={item.token_address}
          amount={item.incentive}
          currencySize={'32px'}
          textSize={16}
          subTextSize={13}
        />
        // <OutlineButton key={1} width="94px" height="32px" fontSize={13} primary>
        //   Cancel
        // </OutlineButton>
      ]),
    [liveOfferList]
  )

  return (
    <Box>
      <Typography fontSize={16} fontWeight={500} mb={20} ml={20}>
        My Live Offer
      </Typography>
      <Card width={980} padding="30px 28px">
        <Box display="grid" gap={40}>
          <Table fontSize="12px" header={LiveOfferHeader} rows={liveOfferDataRows} variant="outlined" />
          {liveOfferLoading && (
            <Box display="flex" pt={20} pb={20} justifyContent="center">
              <Spinner size="40px" />
            </Box>
          )}
          {!liveOfferLoading && !liveOfferPage.totalPages && <NoData />}
          <Pagination
            count={liveOfferPage.totalPages}
            page={liveOfferPage.page}
            boundaryCount={0}
            onChange={(_, value) => liveOfferPage.setPage(value)}
          />
        </Box>
      </Card>
    </Box>
  )
}
