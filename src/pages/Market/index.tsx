import { useCallback, useMemo, useState } from 'react'
import { Box, Typography, MenuItem, Grid } from '@mui/material'
import MarketIcon from 'assets/images/market-lg.png'
import LogoText from 'components/LogoText'
import Card from 'components/Card'
import InputSearch from 'components/Input/InputSearch'
import Select from 'components/Select/Select'
import Table from 'components/Table'
import Pagination from 'components/Pagination'
import MarketCard from './MarketCard'
import { ReactComponent as ArrowIcon } from 'assets/svg/ArrowIcon.svg'
import { ChainList } from 'constants/chain'
import UniSwap from 'components/Swap/UniSwap'
import { FilterButton, CardButton, TableButton } from './Buttons'
import { OrderListOrderType, OrderStatus, useOrderList } from 'hooks/useFetchOrderList'
import ChainLogo from 'components/ChainLogo'
import CurrencyInfo from './CurrencyInfo'
import OrderListOperate from './OrderListOperate'
import Spinner from 'components/Spinner'
// import SwapSelect from 'components/Swap/SwapSelect'
import SelectButton from 'components/Button/SelectButton'
import SelectCurrencyModal from 'components/Input/CurrencyInputPanel/SelectCurrencyModal'
import useModal from 'hooks/useModal'
import { Currency } from 'constants/token'
import { Chain } from 'models/chain'
import { useTopTokenSymbolList } from 'state/token/hooks'
import NoData from 'components/NoData'
import JSBI from 'jsbi'

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

const SortByList = [
  {
    name: 'Default sort',
    value: OrderListOrderType.SortByDefault
  },
  {
    name: 'Create time',
    value: OrderListOrderType.SortByCreateTimeDesc
  },
  {
    name: 'Max Amount',
    value: OrderListOrderType.SortByMaxAmount
  },
  {
    name: 'Min Amount',
    value: OrderListOrderType.SortByMinAmount
  },
  {
    name: 'Max Incentive',
    value: OrderListOrderType.SortByMaxIncentive
  },
  {
    name: 'Min Incentive',
    value: OrderListOrderType.SortByMinIncentive
  }
]

export default function Market() {
  const [mode, setMode] = useState(Mode.TABLE)
  const [filterToggle, setFilterToggle] = useState(false)
  const { showModal } = useModal()
  const [searchCurrency, setSearchCurrency] = useState<null | Currency>(null)
  const [searchOrderId, setSearchOrderId] = useState<string>('')
  const [searchOrderBy, setSearchOrderBy] = useState<OrderListOrderType>(OrderListOrderType.SortByDefault)
  const [searchFromChain, setSearchFromChain] = useState<Chain | null>(null)
  const [searchToChain, setSearchToChain] = useState<Chain | null>(null)

  const searchParams = useMemo(() => {
    return {
      fromChain: filterToggle ? searchFromChain?.id || undefined : undefined,
      toChain: filterToggle ? searchToChain?.id || undefined : undefined,
      token: filterToggle ? searchCurrency?.symbol || '' : '',
      id: searchOrderId,
      sortType: searchOrderBy
    }
  }, [filterToggle, searchCurrency?.symbol, searchFromChain?.id, searchOrderBy, searchOrderId, searchToChain?.id])

  const { list: orderList, page: orderListPage, loading } = useOrderList(OrderStatus.Status_wait, searchParams)
  const searchCurrencyList = useTopTokenSymbolList()

  const dataRows = useMemo(() => {
    return orderList.map(item => [
      <Typography key={1} fontSize={16} fontWeight={500}>
        #{item.global_order_id}
      </Typography>,
      <Box
        key={1}
        display="flex"
        alignItems="center"
        gap={10}
        justifyContent={mode === Mode.TABLE ? 'unset' : 'center'}
      >
        <ChainLogo widthEllipsis="52px" chainId={item.chain_id} size={mode === Mode.TABLE ? '32px' : '24px'} />
        <ArrowIcon />
        <ChainLogo widthEllipsis="52px" chainId={item.to_chain_id} size={mode === Mode.TABLE ? '32px' : '24px'} />
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
        <ArrowIcon />
        <CurrencyInfo
          key={0}
          chainId={item.to_chain_id}
          amount={JSBI.subtract(JSBI.BigInt(item.amount), JSBI.BigInt(item.incentive)).toString()}
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
      <OrderListOperate key={1} order={item} width={mode === Mode.TABLE ? '94px' : '100px'} />
    ])
  }, [mode, orderList])

  const onSelectSearchCurrency = useCallback(() => {
    showModal(
      <SelectCurrencyModal
        onSelectCurrency={currency => {
          setSearchCurrency(currency)
        }}
        tokenList={searchCurrencyList}
      />
    )
  }, [searchCurrencyList, showModal])

  return (
    <>
      <Box maxWidth="980px" width="100%" pt={60}>
        <Box width="100%" display="flex" justifyContent="space-between" mb={40}>
          <LogoText logo={MarketIcon} text="Market" size="32px" fontSize={36} fontWeight={700} />
        </Box>
        {filterToggle && (
          <Card width="100%" style={{ marginBottom: 36 }}>
            <Box width="100%" padding="28px 28px 36px" display="flex" gap={56}>
              <Grid container spacing={20} className="transactions">
                <Grid item lg={6} xs={12}>
                  <Box display="grid" gap={20}>
                    <Typography fontSize={16} fontWeight={700}>
                      Currency:
                    </Typography>
                    <SelectButton
                      style={{
                        justifyContent: 'space-between',
                        padding: '0 20px'
                      }}
                      width="100%"
                      onClick={onSelectSearchCurrency}
                    >
                      {searchCurrency ? (
                        <LogoText logo={searchCurrency.logo || ''} text={searchCurrency.symbol || ''} />
                      ) : (
                        <Typography fontSize="16px" color={'rgba(22, 22, 22, 0.5)'}>
                          Select currency
                        </Typography>
                      )}
                    </SelectButton>
                  </Box>
                </Grid>
                <Grid item lg={6} xs={12}>
                  <Box display="grid" gap={20}>
                    <Typography fontSize={16} fontWeight={700}>
                      Route:
                    </Typography>
                    <UniSwap
                      from={searchFromChain}
                      to={searchToChain}
                      list={ChainList}
                      onSelectFrom={e => setSearchFromChain(e)}
                      onSelectTo={e => setSearchToChain(e)}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Card>
        )}
        <Card width="100%">
          <Box width="100%" padding="30px 28px 40px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display={'flex'} gap="10px">
                <InputSearch
                  value={searchOrderId}
                  width={244}
                  onChange={e => setSearchOrderId(e.target.value)}
                  backgroundColor={'#FFFFFF'}
                />
                <FilterButton onClick={() => setFilterToggle(!filterToggle)} selected={filterToggle} />
              </Box>
              <Box>
                <Box display="flex" gap={24}>
                  <Box display="flex" gap={8}>
                    <CardButton onClick={() => setMode(Mode.CARD)} selected={mode === Mode.CARD} />
                    <TableButton onClick={() => setMode(Mode.TABLE)} selected={mode === Mode.TABLE} />
                  </Box>
                </Box>
                <Box display="flex" gap={20} alignItems="center" sx={{ display: 'none' }}>
                  <Typography fontSize={16} fontWeight={700}>
                    Sort by
                  </Typography>
                  <Select
                    value={searchOrderBy.toString()}
                    onChange={e => e.target.value && setSearchOrderBy(Number(e.target.value))}
                    height={60}
                    width="fit-content"
                  >
                    {SortByList.map(({ name, value }) => (
                      <MenuItem value={value.toString()} key={value}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              </Box>
            </Box>
            {mode === Mode.TABLE && (
              <Box mt={40} display="grid" gap={24}>
                <Table fontSize="12px" header={MarketTableHeader} rows={dataRows} variant="outlined" />
                {loading && (
                  <Box display="flex" pt={20} pb={20} justifyContent="center">
                    <Spinner size="40px" />
                  </Box>
                )}
                {!loading && !orderListPage.totalPages && <NoData />}
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
            {loading && (
              <Box display="flex" pt={20} pb={20} justifyContent="center">
                <Spinner size="40px" />
              </Box>
            )}
            {!loading && !orderListPage.totalPages && <NoData />}
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
