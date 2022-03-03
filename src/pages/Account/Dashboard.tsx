import { useState, useMemo } from 'react'
import Card from 'components/Card'
import { Typography, Box } from '@mui/material'
import RoundTabs from 'components/Tabs/RoundTabs'
import LogoText from 'components/LogoText'
import Table from 'components/Table'
import CurrencyText from 'components/CurrencyText'
import ComposedText from 'components/ComposedText'
import DummyLogo from 'assets/svg/eth_logo.svg'
import { ETHER } from 'constants/token'
import Button from 'components/Button/Button'
import StatusTag from 'components/StatusTag'
import OutlineButton from 'components/Button/OutlineButton'

const WalletInfoTableHeader = ['Asset', 'Amount']
const WithdrawlHistoryTableHeader = ['Date', 'Amount', 'Payment Address', 'Status']

export default function Dashboard() {
  const [walletInfoTab, setWalletInfoTab] = useState(0)

  const walletInfoTabs = useMemo(() => {
    return [
      <LogoText key={0} logo={DummyLogo} text={'BSC($908.12)'} />,
      <LogoText key={0} logo={DummyLogo} text={'Ethereum($234.12)'} />
    ]
  }, [])

  const walletInfoDataRows = useMemo(() => {
    return [
      [
        <CurrencyText
          key={0}
          currency={ETHER}
          currencySize={'32px'}
          text={ETHER.symbol || ''}
          subText={ETHER.name || ''}
          textSize={16}
          subTextSize={12}
        />,
        <ComposedText key={0} text={'1286952'} subText={'/123.53'} textSize={16} subTextSize={13} textOpacity={1} />,
        <Button key={0} onClick={() => {}} width="112px" height="36px" fontSize={13}>
          Withdrawl
        </Button>
      ]
    ]
  }, [])

  const withdrawlHistoryDataRows = useMemo(() => {
    return [
      [
        <Typography key={0} fontSize={16}>
          05.07.2021 10:32
        </Typography>,
        <LogoText key={0} logo={DummyLogo} text={'2259.256 DAI'} />,
        <Typography key={0} fontSize={16}>
          0x3550...6206882
        </Typography>,
        <StatusTag key={0} type="pending" />,
        <OutlineButton key={0} onClick={() => {}} width={84} height={36} fontSize={13} primary>
          Details
        </OutlineButton>
      ]
    ]
  }, [])

  return (
    <Box display="grid" gap={24}>
      <Card width={980} padding="30px 28px">
        <Typography fontSize={16} fontWeight={500} mb={28}>
          My Balance
        </Typography>
        <Box display="flex" gap={12} alignItems="center">
          <Typography fontSize={32} fontWeight={700}>
            $ 12345.00
          </Typography>
          <Box
            borderRadius={18}
            bgcolor="rgba(17, 191, 45, 0.16)"
            height={28}
            display="flex"
            alignItems="center"
            padding="0 14px"
          >
            <Typography fontSize={13} color="#11BF2D">
              + 8.91% / $350.28
            </Typography>
          </Box>
        </Box>
      </Card>
      <Card width={980} padding="30px 28px">
        <Typography fontSize={16} fontWeight={500} mb={28}>
          Wallet Information
        </Typography>
        <RoundTabs titles={walletInfoTabs} current={walletInfoTab} onChange={setWalletInfoTab} />
        <Table fontSize="12px" header={WalletInfoTableHeader} rows={walletInfoDataRows} variant="outlined" />
      </Card>
      <Card width={980} padding="30px 28px">
        <Typography fontSize={16} fontWeight={500} mb={28}>
          Withdrawl History
        </Typography>
        <RoundTabs titles={walletInfoTabs} current={walletInfoTab} onChange={setWalletInfoTab} />
        <Table
          fontSize="12px"
          header={WithdrawlHistoryTableHeader}
          rows={withdrawlHistoryDataRows}
          variant="outlined"
        />
      </Card>
    </Box>
  )
}
