import { useMemo, useState } from 'react'
import { Box, Typography, MenuItem, Grid } from '@mui/material'
import OutlineButton from 'components/Button/OutlineButton'
import MarketIcon from 'assets/images/market-lg.png'
import LogoText from 'components/LogoText'
import Card from 'components/Card'
import InputSearch from 'components/Input/InputSearch'
import Select from 'components/Select/Select'
import Table from 'components/Table'
import Button from 'components/Button/Button'
import Pagination from 'components/Pagination'
import MarketCard from './MarketCard'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CurrencyValue from 'components/CurrencyValue'
import { ETHER } from 'constants/token'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { ChainList } from 'constants/chain'
import UniSwap from 'components/Select/UniSwap'

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
  const [page, setPage] = useState(1)
  const [filterToggle, setFilterToggle] = useState(false)

  const dataRows = useMemo(() => {
    return [
      [
        <Typography key={1} fontSize={16} fontWeight={500}>
          #000001
        </Typography>,
        <Box key={1} display="flex" alignItems="center" gap={12}>
          <LogoText
            logo={<CurrencyLogo currency={ETHER} />}
            text="Ether"
            size={mode === Mode.TABLE ? '32px' : '24px'}
          />
          <ArrowForwardIcon />
          <LogoText
            logo={<CurrencyLogo currency={ETHER} />}
            text="Ether"
            size={mode === Mode.TABLE ? '32px' : '24px'}
          />
        </Box>,
        <Box key={1} display="flex" alignItems="center" gap={12}>
          <CurrencyValue
            currency={ETHER}
            currencySize={mode === Mode.TABLE ? '32px' : '24px'}
            value={'123'}
            equivalent={'$123'}
            valueSize={mode === Mode.TABLE ? 16 : 13}
            equivalentSize={mode === Mode.TABLE ? 13 : 11}
          />
          <ArrowForwardIcon />
          <CurrencyValue
            currency={ETHER}
            currencySize={mode === Mode.TABLE ? '32px' : '24px'}
            value={'123'}
            equivalent={'$123'}
            valueSize={mode === Mode.TABLE ? 16 : 13}
            equivalentSize={mode === Mode.TABLE ? 13 : 11}
          />
        </Box>,
        <CurrencyValue
          key={1}
          currency={ETHER}
          currencySize={mode === Mode.TABLE ? '32px' : '24px'}
          value={'123'}
          equivalent={'$123'}
          valueSize={mode === Mode.TABLE ? 16 : 13}
          equivalentSize={mode === Mode.TABLE ? 13 : 11}
        />,
        <Button key={1} width={mode === Mode.TABLE ? '94px' : '120px'} height="32px" fontSize={13}>
          Take Offer
        </Button>
      ]
    ]
  }, [mode])

  return (
    <>
      <Box width="100%" padding={{ xs: 0, md: '60px 94px 0 366px' }}>
        <Box width="100%" display="flex" justifyContent="space-between" mb={40}>
          <LogoText logo={MarketIcon} text="Market" size="32px" fontSize={36} fontWeight={700} />
          <Box display="flex" gap={24}>
            <StyledOutlineButton width={152} height={60} onClick={() => setFilterToggle(!filterToggle)}>
              <LogoText logo={<FilterIcon />} text="Filter" />
            </StyledOutlineButton>
            <Box display="flex" gap={8}>
              <StyledOutlineButton
                width={60}
                height={60}
                selected={mode === Mode.CARD}
                onClick={() => setMode(Mode.CARD)}
              >
                <CardModeIcon />
              </StyledOutlineButton>
              <StyledOutlineButton
                width={60}
                height={60}
                selected={mode === Mode.TABLE}
                onClick={() => setMode(Mode.TABLE)}
              >
                <TableModeIcon />
              </StyledOutlineButton>
            </Box>
          </Box>
        </Box>
        {filterToggle && (
          <Card width="100%" style={{ marginBottom: 36 }}>
            <Box width="100%" padding="28px 28px 36px" display="flex" gap={56}>
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
              <Box display="grid" gap={20}>
                <Typography fontSize={16} fontWeight={700}>
                  Currency:
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
              <InputSearch value={search} width={244} onChange={e => setSearch(e.target.value)} />
              <Box display="flex" gap={20} alignItems="center">
                <Typography fontSize={16} fontWeight={700}>
                  Sort by
                </Typography>
                <Select value="MAX Amount" height={60}>
                  <MenuItem value={'MAX Amount'} key={'MAX Amount'} selected>
                    MAX Amount
                  </MenuItem>
                </Select>
              </Box>
            </Box>
            {mode === Mode.TABLE && (
              <Box mt={40} display="grid" gap={24}>
                <Table fontSize="12px" header={MarketTableHeader} rows={dataRows} variant="outlined" />
                <Pagination count={10} page={page} boundaryCount={0} onChange={(event, value) => setPage(value)} />
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
            <Pagination count={10} page={page} boundaryCount={0} onChange={(event, value) => setPage(value)} />
          </>
        )}
      </Box>
    </>
  )
}

function FilterIcon() {
  return (
    <svg width="14" height="18" viewBox="0 0 14 18" fill="none">
      <path d="M3 17L3 8" stroke="#161616" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 4L3 1" stroke="#161616" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 10L11 1" stroke="#161616" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 17L11 14" stroke="#161616" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="11" cy="12" r="2" transform="rotate(-90 11 12)" stroke="#161616" strokeWidth="1.8" />
      <circle cx="3" cy="6" r="2" transform="rotate(-90 3 6)" stroke="#161616" strokeWidth="1.8" />
    </svg>
  )
}

function TableModeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M1 14H17V16C17 16.5523 16.5523 17 16 17H2C1.44772 17 1 16.5523 1 16V14Z"
        stroke="#161616"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M1 7.5H17V10.5H1V7.5Z" stroke="#161616" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M17 4L1 4V2C1 1.44772 1.44771 1 2 1L16 1C16.5523 1 17 1.44772 17 2V4Z"
        stroke="#161616"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CardModeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M11 11H17V16C17 16.5523 16.5523 17 16 17H12C11.4477 17 11 16.5523 11 16V11Z"
        stroke="#161616"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1 1H7V6C7 6.55228 6.55228 7 6 7H2C1.44772 7 1 6.55228 1 6V1Z"
        stroke="#161616"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1 11H7V16C7 16.5523 6.55228 17 6 17H2C1.44772 17 1 16.5523 1 16V11Z"
        stroke="#161616"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 1H17V6C17 6.55228 16.5523 7 16 7H12C11.4477 7 11 6.55228 11 6V1Z"
        stroke="#161616"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function StyledOutlineButton({
  children,
  width,
  height,
  selected,
  onClick
}: {
  children: React.ReactNode
  width: number
  height: number
  selected?: boolean
  onClick?: (() => void) | null
}) {
  return (
    <OutlineButton
      width={width}
      height={height}
      style={{
        '& > *': { opacity: selected ? 1 : 0.5 },
        '&:hover > *': { opacity: 1 }
      }}
      onClick={onClick}
    >
      {children}
    </OutlineButton>
  )
}
