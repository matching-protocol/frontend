import { useMemo, useState } from 'react'
import { Typography, Box } from '@mui/material'
import Card from 'components/Card'
import Table from 'components/Table'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import Pagination from 'components/Pagination'
// import OutlineButton from 'components/Button/OutlineButton'
import RoundTabs from 'components/Tabs/RoundTabs'
import TextButton from 'components/Button/TextButton'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { useAccountOrderList } from 'hooks/useFetch'
import { AccountOrderRole, AccountOrderStatus } from 'utils/fetch/order'
import ChainLogo from 'components/ChainLogo'
import CurrencyInfo from 'pages/Market/CurrencyInfo'
import Spinner from 'components/Spinner'
import { getEtherscanLink } from 'utils'
import TakeStatus from './TakeStatus'
import NoData from 'components/NoData'

enum Tab {
  MAKE_OFFER,
  TAKE_OFFER
}

const HistoryTabs = ['Make Offer', 'Take Offer']
const HistoryMakeOfferHeader = ['Order ID', 'Route', 'Currency', 'Offer Incentive']
const HistoryTakeOfferHeader = ['Order ID', 'Route', 'Currency', 'Offer Incentive', 'Status']

export default function History() {
  const [tab, setTab] = useState(Tab.MAKE_OFFER)
  const { page: makePage, list: orderMakeList, loading: makeLoading } = useAccountOrderList(
    AccountOrderStatus.OrderAny,
    AccountOrderRole.OrderMake
  )
  const { page: takePage, list: orderTakeList, loading: takeLoading } = useAccountOrderList(
    AccountOrderStatus.OrderAny,
    AccountOrderRole.OrderTake
  )

  const historyMakeOfferDataRows = useMemo(
    () =>
      orderMakeList.map(item => [
        <Typography key={1} fontSize={16} fontWeight={500}>
          #{item.global_order_id}
        </Typography>,
        <Box key={1} display="flex" alignItems="center" gap={12}>
          <ChainLogo chainId={item.chain_id} size={'32px'} />
          <ArrowForwardIcon />
          <ChainLogo chainId={item.to_chain_id} size={'32px'} />
        </Box>,
        <Box key={1} display="flex" alignItems="center" gap={12}>
          <CurrencyInfo
            key={0}
            chainId={item.chain_id}
            amount={item.amount}
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
    [orderMakeList]
  )

  const historyTakeOfferDataRows = useMemo(
    () =>
      orderTakeList.map(item => [
        <Typography key={1} fontSize={16} fontWeight={500}>
          #{item.global_order_id}
        </Typography>,
        <Box key={1} display="flex" alignItems="center" gap={12}>
          <ChainLogo chainId={item.chain_id} size={'32px'} />
          <ArrowForwardIcon />
          <ChainLogo chainId={item.to_chain_id} size={'32px'} />
        </Box>,
        <Box key={1} display="flex" alignItems="center" gap={12}>
          <CurrencyInfo
            key={0}
            chainId={item.chain_id}
            amount={item.amount}
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
        />,
        <TakeStatus key={1} order={item} />,
        <TextButton key={1} onClick={() => window.open(getEtherscanLink(item.chain_id, item.tx_hash, 'transaction'))}>
          <ArrowForwardIosIcon color="primary" sx={{ fontSize: 14 }} />
        </TextButton>
      ]),
    [orderTakeList]
  )

  return (
    <Card width={980} padding="30px 28px">
      <Typography fontSize={16} fontWeight={500} mb={28}>
        Histroy
      </Typography>
      <Box display="grid" gap={40}>
        <RoundTabs titles={HistoryTabs} current={tab} onChange={setTab} />
        {tab === Tab.MAKE_OFFER && (
          <>
            <Table fontSize="12px" header={HistoryMakeOfferHeader} rows={historyMakeOfferDataRows} variant="outlined" />
            {makeLoading && (
              <Box display="flex" pt={20} pb={20} justifyContent="center">
                <Spinner size="40px" />
              </Box>
            )}
            {!makeLoading && !makePage.totalPages && <NoData />}
            <Pagination
              count={makePage.totalPages}
              page={makePage.page}
              boundaryCount={0}
              onChange={(_, value) => makePage.setPage(value)}
            />
          </>
        )}
        {tab === Tab.TAKE_OFFER && (
          <>
            <Table fontSize="12px" header={HistoryTakeOfferHeader} rows={historyTakeOfferDataRows} variant="outlined" />
            {takeLoading && (
              <Box display="flex" pt={20} pb={20} justifyContent="center">
                <Spinner size="40px" />
              </Box>
            )}
            {!takeLoading && !takePage.totalPages && <NoData />}
            <Pagination
              count={takePage.totalPages}
              page={takePage.page}
              boundaryCount={0}
              onChange={(_, value) => takePage.setPage(value)}
            />
          </>
        )}
      </Box>
    </Card>
  )
}
