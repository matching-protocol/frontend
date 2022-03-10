import { useMemo, useState } from 'react'
import { Box, Typography, MenuItem, Grid } from '@mui/material'
import MarketIcon from 'assets/images/market-lg.png'
import LogoText from 'components/LogoText'
import Card from 'components/Card'
import InputSearch from 'components/Input/InputSearch'
import Select from 'components/Select/Select'
import Table from 'components/Table'
import Pagination from 'components/Pagination'
import MarketCard from './MarketCard'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { ChainList } from 'constants/chain'
import UniSwap from 'components/Swap/UniSwap'
import { FilterButton, CardButton, TableButton } from './Buttons'
import { OrderStatus, useOrderList } from 'hooks/useFetch'
import ChainLogo from 'components/ChainLogo'
import CurrencyInfo from './CurrencyInfo'
import OrderListOperate from './OrderListOperate'
import Spinner from 'components/Spinner'
import SwapSelect from 'components/Swap/SwapSelect'

enum Mode {
  TABLE,
  CARD
}

export enum MarketTableHeaderIndex {
  orderId,
  route,
  currency,
  offerIncentive,
  action
}

export const MarketTableHeader = ['Order ID', 'Route', 'Currency', 'Offer Incentive', '']

export default function Market() {
  const [mode, setMode] = useState(Mode.TABLE)
  const [search, setSearch] = useState('')
  const [filterToggle, setFilterToggle] = useState(false)
  const { list: orderList, page: orderListPage, loading } = useOrderList(OrderStatus.Order_ALL)

  const dataRows = useMemo(() => {
    return orderList.map(item => [
      <Typography key={1} fontSize={16} fontWeight={500}>
        #{item.global_order_id}
      </Typography>,
      <Box key={1} display="flex" alignItems="center" gap={12}>
        <ChainLogo chainId={item.chain_id} size={mode === Mode.TABLE ? '32px' : '24px'} />
        <ArrowForwardIcon />
        <ChainLogo chainId={item.to_chain_id} size={mode === Mode.TABLE ? '32px' : '24px'} />
      </Box>,
      <Box key={1} display="flex" alignItems="center" gap={12}>
        <CurrencyInfo
          key={0}
          chainId={item.chain_id}
          amount={item.amount}
          address={item.token_address}
          currencySize={mode === Mode.TABLE ? '32px' : '24px'}
          textSize={mode === Mode.TABLE ? 16 : 13}
          subTextSize={mode === Mode.TABLE ? 13 : 11}
        />
        <ArrowForwardIcon />
        <CurrencyInfo
          key={0}
          chainId={item.to_chain_id}
          address={item.receive_token_address}
          currencySize={mode === Mode.TABLE ? '32px' : '24px'}
          textSize={mode === Mode.TABLE ? 16 : 13}
          subTextSize={mode === Mode.TABLE ? 13 : 11}
        />
      </Box>,
      <CurrencyInfo
        key={0}
        chainId={item.chain_id}
        address={item.token_address}
        amount={item.incentive}
        currencySize={mode === Mode.TABLE ? '32px' : '24px'}
        textSize={mode === Mode.TABLE ? 16 : 13}
        subTextSize={mode === Mode.TABLE ? 13 : 11}
      />,
      <OrderListOperate key={1} order={item} width={mode === Mode.TABLE ? '94px' : '120px'} />
    ])
  }, [mode, orderList])

  return (
    <>
      <Box maxWidth="980px" width="100%" pt={60}>
        <Box width="100%" display="flex" justifyContent="space-between" mb={40}>
          <LogoText logo={MarketIcon} text="Market" size="32px" fontSize={36} fontWeight={700} />
          <Box display="flex" gap={24}>
            <FilterButton onClick={() => setFilterToggle(!filterToggle)} selected={filterToggle} />
            <Box display="flex" gap={8}>
              <CardButton onClick={() => setMode(Mode.CARD)} selected={mode === Mode.CARD} />
              <TableButton onClick={() => setMode(Mode.TABLE)} selected={mode === Mode.TABLE} />
            </Box>
          </Box>
        </Box>
        {filterToggle && (
          <Card width="100%" style={{ marginBottom: 36 }}>
            <Box width="100%" padding="28px 28px 36px" display="flex" gap={56}>
              <Box display="grid" gap={20}>
                <Typography fontSize={16} fontWeight={700}>
                  Currency:
                </Typography>
                <SwapSelect
                  list={[]}
                  selected={1}
                  width="192px"
                  height="60px"
                  onChange={() => {}}
                  disabled={false}
                  active={false}
                />
              </Box>
              <Box display="grid" gap={20}>
                <Typography fontSize={16} fontWeight={700}>
                  Route:
                </Typography>
                <UniSwap
                  from={ChainList[0]}
                  to={ChainList[1]}
                  list={ChainList}
                  onSelectFrom={() => {}}
                  onSelectTo={() => {}}
                />
              </Box>
            </Box>
          </Card>
        )}
        <Card width="100%">
          <Box width="100%" padding="30px 28px 40px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <InputSearch
                value={search}
                width={244}
                onChange={e => setSearch(e.target.value)}
                backgroundColor={'#FFFFFF'}
              />
              <Box display="flex" gap={20} alignItems="center">
                <Typography fontSize={16} fontWeight={700}>
                  Sort by
                </Typography>
                <Select value="MAX Amount" height={60} width="fit-content">
                  <MenuItem value={'MAX Amount'} key={'MAX Amount'}>
                    MAX Amount
                  </MenuItem>
                  <MenuItem value={'Another'} key={'Another'}>
                    Another
                  </MenuItem>
                </Select>
              </Box>
            </Box>
            {mode === Mode.TABLE && (
              <Box mt={40} display="grid" gap={24}>
                <Table fontSize="12px" header={MarketTableHeader} rows={dataRows} variant="outlined" />
                {loading && (
                  <Box display="flex" justifyContent="center">
                    <Spinner size="40px" />
                  </Box>
                )}
                <Pagination
                  count={orderListPage.totalPages}
                  page={orderListPage.page}
                  boundaryCount={0}
                  onChange={(_, value) => orderListPage.setPage(value)}
                />
              </Box>
            )}
          </Box>
        </Card>
        {mode === Mode.CARD && (
          <>
            <Grid container spacing={20} mt={24} mb={24}>
              {dataRows.map((row, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <MarketCard row={row} header={MarketTableHeader} />
                </Grid>
              ))}
            </Grid>
            <Pagination
              count={orderListPage.totalPages}
              page={orderListPage.page}
              boundaryCount={0}
              onChange={(_, value) => orderListPage.setPage(value)}
            />
          </>
        )}
      </Box>
    </>
  )
}
