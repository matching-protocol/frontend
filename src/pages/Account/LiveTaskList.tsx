import { useMemo } from 'react'
import { Typography, Box } from '@mui/material'
import Card from 'components/Card'
import Table from 'components/Table'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import Pagination from 'components/Pagination'
import { useAccountOrderList } from 'hooks/useFetch'
import { AccountOrderRole, AccountOrderStatus } from 'utils/fetch/order'
import ChainLogo from 'components/ChainLogo'
import CurrencyInfo from 'pages/Market/CurrencyInfo'
import Spinner from 'components/Spinner'
import TakeStatus from './TakeStatus'
import NoData from 'components/NoData'
import JSBI from 'jsbi'

export const LiveTaskListHeader = ['Order ID', 'Route', 'Currency', 'Offer Incentive', '']

export default function LiveTaskList() {
  const { page: liveTaskPage, list: liveTaskList, loading: liveTaskLoading } = useAccountOrderList(
    AccountOrderStatus.OrderLive,
    AccountOrderRole.OrderTake
  )

  const liveTaskDataRows = useMemo(
    () =>
      liveTaskList.map(item => [
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
        />,
        <TakeStatus key={1} order={item} />
      ]),
    [liveTaskList]
  )

  return (
    <Box>
      <Typography fontSize={16} fontWeight={500} mb={20} ml={20}>
        Live Task List
      </Typography>
      <Card width={980} padding="30px 28px">
        <Box display="grid" gap={40}>
          <Table fontSize="12px" header={LiveTaskListHeader} rows={liveTaskDataRows} variant="outlined" />
          {liveTaskLoading && (
            <Box display="flex" pt={20} pb={20} justifyContent="center">
              <Spinner size="40px" />
            </Box>
          )}
          {!liveTaskLoading && !liveTaskPage.totalPages && <NoData />}
          <Pagination
            count={liveTaskPage.totalPages}
            page={liveTaskPage.page}
            boundaryCount={0}
            onChange={(_, value) => liveTaskPage.setPage(value)}
          />
        </Box>
      </Card>
    </Box>
  )
}
