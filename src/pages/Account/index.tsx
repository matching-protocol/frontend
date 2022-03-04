import { useState } from 'react'
import { Box } from '@mui/material'
import LogoText from 'components/LogoText'
import AccountIcon from 'assets/images/account-lg.png'
import PlainTabs from 'components/Tabs/PlainTabs'
import Dashboard from './Dashboard'
import LiveOffer from './LiveOffer'
import LiveTaskList from './LiveTaskList'
import History from './History'

enum Tab {
  DASHBOARD,
  LIVE_OFFER,
  LIVE_TASK,
  HISTORY
}

const Tabs = ['Dashboard', 'Live Offer', 'Live Task List', 'History']

export default function Account() {
  const [tab, setTab] = useState(Tab.DASHBOARD)

  return (
    <>
      <Box maxWidth="980px" width="100%" pt={60} pb={94}>
        <Box width="100%" display="flex" justifyContent="space-between" mb={40}>
          <LogoText logo={AccountIcon} text="Account" size="32px" fontSize={36} fontWeight={700} />
          <PlainTabs titles={Tabs} current={tab} onChange={setTab} />
        </Box>
        {tab === Tab.DASHBOARD && <Dashboard />}
        {tab === Tab.LIVE_OFFER && <LiveOffer />}
        {tab === Tab.LIVE_TASK && <LiveTaskList />}
        {tab === Tab.HISTORY && <History />}
      </Box>
    </>
  )
}
