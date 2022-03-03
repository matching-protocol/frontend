import { useState, useMemo } from 'react'
import Card from 'components/Card'
import { Typography, Box } from '@mui/material'
import RoundTabs from 'components/Tabs/RoundTabs'
import LogoText from 'components/LogoText'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import DummyLogo from 'assets/svg/eth_logo.svg'

export default function Dashboard() {
  const [walletInfoTab, setWalletInfoTab] = useState(0)

  const walletInfoTabs = useMemo(() => {
    return [
      <LogoText key={0} logo={DummyLogo} text={'BSC($908.12)'} />,
      <LogoText key={0} logo={DummyLogo} text={'Ethereum($234.12)'} />
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
      </Card>
    </Box>
  )
}
