import { useCallback, useState } from 'react'
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
import SelectCurrencyModal from 'components/Input/CurrencyInputPanel/SelectCurrencyModal'
import useModal from 'hooks/useModal'

export default function Offer() {
  const [fromChain, setFromChain] = useState<Chain | null>(null)
  const [toChain, setToChain] = useState<Chain | null>(null)
  const [fromCurrency, setFromCurrency] = useState<Currency | null>(null)
  const [toCurrency, setToCurrency] = useState<Currency | null>(null)
  const [fromValue, setFromValue] = useState('')
  const [toValue, setToValue] = useState('')
  const { showModal } = useModal()

  const chainList = ChainList
  const currencyList: Currency[] = []

  const onSelectFromCurrency = useCallback(() => {
    showModal(<SelectCurrencyModal onSelectCurrency={currency => setFromCurrency(currency as Currency)} />)
  }, [])

  const onSelectToCurrency = useCallback(() => {
    showModal(<SelectCurrencyModal onSelectCurrency={currency => setToCurrency(currency as Currency)} />)
  }, [])

  return (
    <Box pt={68} display="grid" gap={20} maxWidth={828} width="100%">
      <Card width="100%" padding="24px 60px 44px">
        <LogoText logo={OfferIcon} text=" Make an Offer" size="32px" fontSize={36} fontWeight={700} />
        <Box mt={32}>
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
            onSelectFromCurrency={onSelectFromCurrency}
            onSelectToCurrency={onSelectToCurrency}
            onChangeFromValue={e => setFromValue(e.target.value)}
            onChangeToValue={e => setToValue(e.target.value)}
          />
        </Box>

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
