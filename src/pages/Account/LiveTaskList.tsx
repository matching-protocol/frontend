import { useMemo, useState } from 'react'
import { Typography, Box } from '@mui/material'
import Card from 'components/Card'
import Table from 'components/Table'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CurrencyText from 'components/CurrencyText'
import { ETHER } from 'constants/token'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import LogoText from 'components/LogoText'
import OutlineButton from 'components/Button/OutlineButton'
import Pagination from 'components/Pagination'

export const LiveTaskListHeader = ['Order ID', 'Route', 'Currency', 'Offer Incentive', '']

export default function LiveTaskList() {
  const [page, setPage] = useState(1)

  const liveTaskDataRows = useMemo(() => {
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
        <OutlineButton key={1} width="124px" height="44px" fontSize={13} borderRadius={57} primary>
          <Box>
            <Typography fontSize={13}>Execute Fund</Typography>
            <Typography fontSize={11} sx={{ opacity: 0.5 }}>
              Closes in 00:0:00
            </Typography>
          </Box>
        </OutlineButton>
      ]
    ]
  }, [])

  return (
    <Card width={980} padding="30px 28px">
      <Typography fontSize={16} fontWeight={500} mb={28}>
        My Live Offer
      </Typography>
      <Box display="grid" gap={40}>
        <Table fontSize="12px" header={LiveTaskListHeader} rows={liveTaskDataRows} variant="outlined" />
        <Pagination count={10} page={page} boundaryCount={0} onChange={(event, value) => setPage(value)} />
      </Box>
    </Card>
  )
}
