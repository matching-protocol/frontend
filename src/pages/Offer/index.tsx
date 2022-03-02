import { useCallback, useState, useMemo } from 'react'
import Card from 'components/Card'
import { Box, Typography } from '@mui/material'
import LogoText from 'components/LogoText'
import OfferIcon from 'assets/images/offer.png'
import { ChainList } from 'constants/chain'
import Input from 'components/Input'
import ActionButton from 'components/Button/ActionButton'
import Divider from 'components/Divider'
import WarningCard from './WarningCard'
import BiSwap from 'components/Swap/BiSwap'
import { Currency } from 'constants/token/currency'
import { Chain } from 'models/chain'
import SelectCurrencyModal from 'components/Input/CurrencyInputPanel/SelectCurrencyModal'
import useModal from 'hooks/useModal'
import ComposedText from 'components/ComposedText'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'

enum ERROR {
  SELECT_CHAIN = 'Select Chain',
  SELECT_ASSET = 'Select Asset',
  ENTER_AMOUNT = 'Enter Amount'
}

export default function Offer() {
  const [fromChain, setFromChain] = useState<Chain | null>(null)
  const [toChain, setToChain] = useState<Chain | null>(null)
  const [fromCurrency, setFromCurrency] = useState<Currency | null>(null)
  const [toCurrency, setToCurrency] = useState<Currency | null>(null)
  const [fromValue, setFromValue] = useState('')
  const [toValue, setToValue] = useState('')
  const [incentive, setIncentive] = useState('')
  const { showModal } = useModal()

  const chainList = ChainList
  const currencyList: Currency[] = useMemo(() => [], [])

  const onSelectFromCurrency = useCallback(() => {
    showModal(
      <SelectCurrencyModal
        onSelectCurrency={currency => setFromCurrency(currency as Currency)}
        tokenList={currencyList}
      />
    )
  }, [currencyList, showModal])

  const onSelectToCurrency = useCallback(() => {
    showModal(
      <SelectCurrencyModal
        onSelectCurrency={currency => setToCurrency(currency as Currency)}
        tokenList={currencyList}
      />
    )
  }, [currencyList, showModal])

  const getError = useMemo(() => {
    if (!fromChain || !toChain) {
      return ERROR.SELECT_CHAIN
    }

    if (!fromCurrency || !toCurrency) {
      return ERROR.SELECT_ASSET
    }

    if (!fromValue || !toValue || !incentive) {
      return ERROR.ENTER_AMOUNT
    }

    return undefined
  }, [fromChain, toChain, fromCurrency, toCurrency, fromValue, toValue, incentive])

  const onSwitch = useCallback(() => {
    const switchedToChain = fromChain
    const switchedFromChain = toChain
    const switchedToCurrency = fromCurrency
    const switchedFromCurrency = toCurrency
    setToChain(switchedToChain)
    setFromChain(switchedFromChain)
    setToCurrency(switchedToCurrency)
    setFromCurrency(switchedFromCurrency)
  }, [fromChain, toChain, fromCurrency, toCurrency])

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
            fromSubStr={'0.001BTC = $286.01'}
            toSubStr={'0.001BTC = $286.01'}
            onSwitch={onSwitch}
          />
        </Box>

        <Divider style={{ marginTop: 48, marginBottom: 24 }} extension={60} />
        <Box display="flex" gap={24} mb={32}>
          <Input
            label="Incentive"
            value={incentive}
            placeholder={'Input Amount'}
            maxWidth="339px"
            subStr="You need to decide how much you want to incentivize market maker to fill the offer"
            onChange={e => setIncentive(e.target.value)}
          />
          <Box>
            <Box display="flex" gap={16} alignItems="start">
              <Box display="grid" gap={8}>
                <Typography fontSize={14} fontWeight={500} sx={{ opacity: 0.5 }}>
                  Recommend
                </Typography>
                <Box
                  border="1px solid #D9D9DA"
                  borderRadius="16px"
                  display="flex"
                  alignItems="center"
                  pl={20}
                  width={164}
                  height={60}
                >
                  <ComposedText text={'> 0.00 '} subText={'/ $0.00'} />
                </Box>
              </Box>
              <Box display="grid" gap={8}>
                <ComposedText text={'Min'} subText={' (slightly higher than gas fee)'} textSize={14} subTextSize={10} />
                <Box
                  border="1px solid #D9D9DA"
                  borderRadius="16px"
                  display="flex"
                  alignItems="center"
                  pl={20}
                  width={164}
                  height={60}
                >
                  <ComposedText text={'> 0.00'} subText={' / $0.00'} />
                </Box>
              </Box>
            </Box>
            <Typography fontSize={12} fontWeight={400} sx={{ opacity: 0.5 }} mt={12}>
              Configuring the right Offer Incentive can make your deal faster
            </Typography>
          </Box>
        </Box>

        <ActionButton
          error={getError}
          actionText="Make an Offer"
          onAction={() => showModal(<TransactionSubmittedModal hash="123" />)}
        />
      </Card>
      <WarningCard />
    </Box>
  )
}
