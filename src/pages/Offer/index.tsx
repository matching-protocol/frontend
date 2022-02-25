import Card from 'components/Card'
import { Box } from '@mui/material'
import LogoText from 'components/LogoText'
import OfferIcon from 'assets/images/offer.png'
import ChainSwap from 'components/Select/ChainSwap'
import { ChainList } from 'constants/chain'
import Input from 'components/Input'
import ActionButton from 'components/Button/ActionButton'
import Divider from 'components/Divider'
import WarningCard from './WarningCard'

export default function Offer() {
  return (
    <Box pt={68} display="grid" gap={20} maxWidth={828} width="100%">
      <Card width="100%" padding="24px 60px 44px">
        <LogoText logo={OfferIcon} text=" Make an Offer" size="32px" fontSize={36} fontWeight={700} />
        <ChainSwap
          from={ChainList[0]}
          to={ChainList[1]}
          list={ChainList}
          onSelectFrom={() => {}}
          onSelectTo={() => {}}
        />
        <Divider style={{ marginTop: 48, marginBottom: 24 }} />
        {/* <InputLabel style={{ marginTop: 24 }}>Incentive</InputLabel> */}
        <Box display="flex" gap={29} alignItems="center" mb={32}>
          <Input
            label="Incentive"
            value={''}
            placeholder={'Input Amount'}
            maxWidth="339px"
            subStr="You need to decide how much you want to incentivize market maker to fill the offer"
          />
        </Box>
        <ActionButton error="Select a Chain" actionText="Make an Offer" onAction={() => {}} />
      </Card>
      <WarningCard />
    </Box>
  )
}
