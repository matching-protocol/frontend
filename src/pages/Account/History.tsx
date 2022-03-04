import { useMemo, useState } from 'react'
import { Typography, Box } from '@mui/material'
import Card from 'components/Card'
import Table from 'components/Table'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CurrencyText from 'components/CurrencyText'
import { ETHER } from 'constants/token'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import LogoText from 'components/LogoText'
import Pagination from 'components/Pagination'
import OutlineButton from 'components/Button/OutlineButton'
import RoundTabs from 'components/Tabs/RoundTabs'
import StatusTag from 'components/StatusTag'
import TextButton from 'components/Button/TextButton'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

enum Tab {
  MAKE_OFFER,
  TAKE_OFFER
}

const HistoryTabs = ['Make Offer', 'Take Offer']
const HistoryMakeOfferHeader = ['Order ID', 'Route', 'Currency', 'Offer Incentive']
const HistoryTakeOfferHeader = ['Order ID', 'Route', 'Currency', 'Offer Incentive', 'Status']

export default function History() {
  const [page, setPage] = useState(1)
  const [tab, setTab] = useState(Tab.MAKE_OFFER)

  const historyMakeOfferDataRows = useMemo(() => {
    return [
      [
        <Typography key={1} fontSize={16} fontWeight={500}>
          #000001
        </Typography>,
        <Box key={1} display="flex" alignItems="center" gap={12}>
          <LogoText logo={<CurrencyLogo currency={ETHER} />} text="Ether" size={'32px'} />
          <ArrowForwardIcon />
          <LogoText logo={<CurrencyLogo currency={ETHER} />} text="Ether" size={'32px'} />
        </Box>,
        <Box key={1} display="flex" alignItems="center" gap={12}>
          <CurrencyText
            currency={ETHER}
            currencySize={'32px'}
            text={'123'}
            subText={'$123'}
            textSize={16}
            subTextSize={13}
          />
          <ArrowForwardIcon />
          <CurrencyText
            currency={ETHER}
            currencySize={'32px'}
            text={'123'}
            subText={'$123'}
            textSize={16}
            subTextSize={13}
          />
        </Box>,
        <CurrencyText
          key={1}
          currency={ETHER}
          currencySize={'32px'}
          text={'123'}
          subText={'$123'}
          textSize={16}
          subTextSize={13}
        />,
        <OutlineButton key={1} width="94px" height="32px" fontSize={13} primary>
          Cancel
        </OutlineButton>
      ]
    ]
  }, [])

  const historyTakeOfferDataRows = useMemo(() => {
    return [
      [
        <Typography key={1} fontSize={16} fontWeight={500}>
          #000001
        </Typography>,
        <Box key={1} display="flex" alignItems="center" gap={12}>
          <LogoText logo={<CurrencyLogo currency={ETHER} />} text="Ether" size={'32px'} />
          <ArrowForwardIcon />
          <LogoText logo={<CurrencyLogo currency={ETHER} />} text="Ether" size={'32px'} />
        </Box>,
        <Box key={1} display="flex" alignItems="center" gap={12}>
          <CurrencyText
            currency={ETHER}
            currencySize={'32px'}
            text={'123'}
            subText={'$123'}
            textSize={16}
            subTextSize={13}
          />
          <ArrowForwardIcon />
          <CurrencyText
            currency={ETHER}
            currencySize={'32px'}
            text={'123'}
            subText={'$123'}
            textSize={16}
            subTextSize={13}
          />
        </Box>,
        <CurrencyText
          key={1}
          currency={ETHER}
          currencySize={'32px'}
          text={'123'}
          subText={'$123'}
          textSize={16}
          subTextSize={13}
        />,
        <StatusTag key={1} type="complete" />,
        <TextButton key={1} onClick={() => {}}>
          <ArrowForwardIosIcon color="primary" sx={{ fontSize: 14 }} />
        </TextButton>
      ]
    ]
  }, [])

  return (
    <Card width={980} padding="30px 28px">
      <Typography fontSize={16} fontWeight={500} mb={28}>
        Histroy
      </Typography>
      <Box display="grid" gap={40}>
        <RoundTabs titles={HistoryTabs} current={tab} onChange={setTab} />
        <Table
          fontSize="12px"
          header={tab === Tab.MAKE_OFFER ? HistoryMakeOfferHeader : HistoryTakeOfferHeader}
          rows={tab === Tab.MAKE_OFFER ? historyMakeOfferDataRows : historyTakeOfferDataRows}
          variant="outlined"
        />
        <Pagination count={10} page={page} boundaryCount={0} onChange={(event, value) => setPage(value)} />
      </Box>
    </Card>
  )
}
