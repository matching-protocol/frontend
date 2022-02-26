import { useState } from 'react'
import Card from 'components/Card'
import { Box } from '@mui/material'
import LogoText from 'components/LogoText'
import OfferIcon from 'assets/images/offer.png'
import { ChainList } from 'constants/chain'
import Input from 'components/Input'
import ActionButton from 'components/Button/ActionButton'
import Divider from 'components/Divider'
import WarningCard from './WarningCard'
import BiSwap from 'components/Swap/BiSwap'
import { Currency } from 'constants/token/currency'

export default function Offer() {
  const [fromChain, setFromChain] = useState(null)
  const [toChain, setToChain] = useState(null)
  const [fromCurrency, setFromCurrency] = useState(null)
  const [toCurrency, setToCurrency] = useState(null)
  const [fromValue, setFromValue] = useState('')
  const [toValue, setToValue] = useState('')
  const chainList = ChainList
  const currencyList: Currency[] = []

  return (
    <Box pt={68} display="grid" gap={20} maxWidth={828} width="100%">
      <Card width="100%" padding="24px 60px 44px">
        <LogoText logo={OfferIcon} text=" Make an Offer" size="32px" fontSize={36} fontWeight={700} />
        <BiSwap
          fromLabel={"You'll send"}
          toLabel={"You'll reveive"}
          fromChain={fromChain}
          fromCurrency={fromCurrency}
          fromValue={fromValue}
          toChain={toChain}
          toCurrency={toCurrency}
          toValue={toValue}
          chainList={chainList}
          currencyList={currencyList}
          onSelectFromChain={setFromChain}
          onSelectToChain={setToChain}
          onSelectFromCurrency={setFromCurrency}
          onSelectToCurrency={setToCurrency}
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
