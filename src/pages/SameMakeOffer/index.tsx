import { Box, Typography } from '@mui/material'
import Button from 'components/Button/Button'
import Card from 'components/Card'
import SelectCurrencyModal from 'components/Input/CurrencyInputPanel/SelectCurrencyModal'
import { ChainListMap } from 'constants/chain'
import { Currency, Token } from 'constants/token'
import { useActiveWeb3React } from 'hooks'
import { useIncentiveList } from 'hooks/useIncentive'
import useModal from 'hooks/useModal'
import { Chain } from 'models/chain'
import Stepper from 'pages/TakeOffer/Stepper'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useWalletModalToggle } from 'state/application/hooks'
import { getLocalTokenByPlatformId, useTokenSupportChain, useTopTokenSymbolList } from 'state/token/hooks'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { Dots } from 'theme/components'
import { tryParseAmount } from 'utils/parseAmount'
import { triggerSwitchChain } from 'utils/triggerSwitchChain'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import { useCreateOrderCallback } from 'hooks/useCreateOrderCallback'
import TransactionPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import One from './One'
import Two from './Two'
import Three from './Three'
import { MATCHING_ADDRESS } from '../../constants'
import { useHistory } from 'react-router-dom'
import { routes } from 'constants/routes'

enum MakeOfferStep {
  Information,
  Incentive,
  Confirmation
}

enum ERROR {
  SELECT_CHAIN = 'Select Chain',
  SELECT_ASSET = 'Select Asset',
  ENTER_AMOUNT = 'Enter Amount',
  CONNECT_WALLET = 'Connect wallet',
  BALANCE_LOADING = 'Balance loading',
  BALANCE_INSUFFICIENT = 'Balance Insufficient',
  ENTER_INCENTIVE = 'Enter incentive',
  LESS_INCENTIVE = 'material incentives are too low',
  NEXT_STEP = 'Next Step'
}

export default function Index() {
  const { account, chainId, library } = useActiveWeb3React()
  const allCurrencyList = useTopTokenSymbolList()
  const history = useHistory()
  const [step, setStep] = useState<MakeOfferStep>(MakeOfferStep.Information)
  const [topCurrency, setTopCurrency] = useState<null | Currency>(null)
  const [fromChain, setFromChain] = useState<Chain | null>(null)
  const [toChain, setToChain] = useState<Chain | null>(null)
  const [swapAmount, setSwapAmount] = useState('')
  const [incentiveAmount, setIncentiveAmount] = useState('')
  const toggleWalletModal = useWalletModalToggle()
  const { showModal, hideModal } = useModal()

  const onSelectFromCurrency = useCallback(() => {
    allCurrencyList.length &&
      showModal(
        <SelectCurrencyModal
          onSelectCurrency={currency => {
            setTopCurrency(currency)
          }}
          tokenList={allCurrencyList}
        />
      )
  }, [allCurrencyList, showModal])

  const supportChainList = useTokenSupportChain(topCurrency)

  useEffect(() => {
    if (!supportChainList.find(i => i === toChain)) {
      setToChain(null)
    }
    if (!supportChainList.find(i => i === fromChain)) {
      setFromChain(null)
    }
  }, [fromChain, topCurrency, supportChainList, toChain])

  const onSwitch = useCallback(() => {
    const switchedToChain = fromChain
    const switchedFromChain = toChain
    setToChain(switchedToChain)
    setFromChain(switchedFromChain)
  }, [fromChain, toChain])

  const fromCurrency = useMemo(() => {
    if (!fromChain?.id || !topCurrency?.platformId) return undefined
    return getLocalTokenByPlatformId(fromChain.id, topCurrency.platformId)
  }, [fromChain, topCurrency])

  const toCurrency = useMemo(() => {
    if (!toChain?.id || !topCurrency?.platformId) return undefined
    return getLocalTokenByPlatformId(toChain.id, topCurrency.platformId)
  }, [toChain, topCurrency])

  const fromCurrencyBalance = useCurrencyBalance(account || undefined, fromCurrency || undefined)

  const exchangeCurrencyAmount = useMemo(() => tryParseAmount(swapAmount, fromCurrency || undefined), [
    fromCurrency,
    swapAmount
  ])
  const incentiveCurrencyAmount = useMemo(() => tryParseAmount(incentiveAmount, fromCurrency || undefined), [
    fromCurrency,
    incentiveAmount
  ])
  const { min: incentiveMin } = useIncentiveList(exchangeCurrencyAmount)

  const createOrderCallback = useCreateOrderCallback()
  const onCreateOrderCallback = useCallback(() => {
    if (!fromCurrency || !toChain || !toChain.id || !account || !exchangeCurrencyAmount || !incentiveCurrencyAmount)
      return
    if (!(fromCurrency instanceof Token)) {
      return
    }
    showModal(<TransactionPendingModal />)
    createOrderCallback(
      fromCurrency.address,
      account,
      exchangeCurrencyAmount.raw.toString(),
      incentiveCurrencyAmount.raw.toString(),
      toChain.id
    )
      .then(hash => {
        hideModal()
        showModal(
          <TransactionSubmittedModal
            hash={hash}
            customOnDismiss={() => {
              hideModal()
              history.replace(routes.market)
            }}
            closeText="Go to market"
          >
            <Typography fontSize={14}>
              It takes time for the offer to be on the chain, you may need to wait a few minutes to see the offer order.
            </Typography>
          </TransactionSubmittedModal>
        )
      })
      .catch((err: any) => {
        hideModal()
        showModal(
          <MessageBox type="error">{err.error && err.error.message ? err.error.message : err?.message}</MessageBox>
        )
        console.error(err)
      })
  }, [
    fromCurrency,
    toChain,
    account,
    exchangeCurrencyAmount,
    incentiveCurrencyAmount,
    showModal,
    createOrderCallback,
    hideModal,
    history
  ])

  const [approvalState, approvalCallback] = useApproveCallback(
    exchangeCurrencyAmount,
    chainId ? MATCHING_ADDRESS[chainId] : undefined
  )

  const stepNextBtn = useMemo(() => {
    if (!topCurrency) {
      return <Button disabled>{ERROR.SELECT_ASSET}</Button>
    }
    if (!fromChain?.id || !toChain?.id) {
      return <Button disabled>{ERROR.SELECT_CHAIN}</Button>
    }

    if (!account || !library) {
      return <Button onClick={toggleWalletModal}>{ERROR.CONNECT_WALLET}</Button>
    }

    if (chainId !== fromChain?.id) {
      return (
        <Button onClick={() => fromChain.id && triggerSwitchChain(library, fromChain.id, account)}>{`Switch to ${
          ChainListMap[fromChain.id].symbol
        }`}</Button>
      )
    }

    if (!swapAmount || !exchangeCurrencyAmount) {
      return <Button disabled>{ERROR.ENTER_AMOUNT}</Button>
    }

    if (!fromCurrencyBalance) {
      return (
        <Button disabled>
          {ERROR.BALANCE_LOADING}
          <Dots />
        </Button>
      )
    }

    if (fromCurrencyBalance.lessThan(exchangeCurrencyAmount)) {
      return <Button disabled>{ERROR.BALANCE_INSUFFICIENT}</Button>
    }

    if (step === MakeOfferStep.Information) {
      return <Button onClick={() => setStep(MakeOfferStep.Incentive)}>{ERROR.NEXT_STEP}</Button>
    }

    if (!incentiveCurrencyAmount || !incentiveCurrencyAmount.greaterThan('0')) {
      return <Button disabled>{ERROR.ENTER_INCENTIVE}</Button>
    }

    if (!incentiveMin || incentiveCurrencyAmount.lessThan(incentiveMin)) {
      return <Button disabled>{ERROR.LESS_INCENTIVE}</Button>
    }

    if (exchangeCurrencyAmount.add(incentiveCurrencyAmount).greaterThan(fromCurrencyBalance)) {
      return <Button disabled>{ERROR.BALANCE_INSUFFICIENT}</Button>
    }

    if (step === MakeOfferStep.Incentive) {
      return <Button onClick={() => setStep(MakeOfferStep.Confirmation)}>{ERROR.NEXT_STEP}</Button>
    }

    if (approvalState !== ApprovalState.APPROVED) {
      if (approvalState === ApprovalState.PENDING) {
        return (
          <Button disabled>
            Approving
            <Dots />
          </Button>
        )
      } else if (approvalState === ApprovalState.NOT_APPROVED) {
        return <Button onClick={approvalCallback}>Approve</Button>
      } else {
        return (
          <Button disabled>
            Loading
            <Dots />
          </Button>
        )
      }
    }

    return <Button onClick={onCreateOrderCallback}>Confirm</Button>
  }, [
    account,
    onCreateOrderCallback,
    approvalCallback,
    approvalState,
    chainId,
    exchangeCurrencyAmount,
    fromChain?.id,
    fromCurrencyBalance,
    incentiveCurrencyAmount,
    incentiveMin,
    library,
    step,
    swapAmount,
    toChain?.id,
    toggleWalletModal,
    topCurrency
  ])

  return (
    <Box pt={52} display="grid" gap={20} maxWidth={788} width="100%">
      <Card padding={'24px 58px 52px'}>
        <Box display="flex" justifyContent="space-between" mb={32} alignItems="center">
          <Box display={'flex'} alignItems="center" flexWrap={'wrap'}>
            <Typography fontSize={28} fontWeight={700} mr="15px">
              {step === MakeOfferStep.Information
                ? 'Transfer Information'
                : step === MakeOfferStep.Incentive
                ? 'Incentive'
                : 'Offer Confirmation'}
            </Typography>
            <Box
              sx={{
                padding: '2px 32px',
                border: '1px solid #161616',
                borderRadius: '16px',
                fontSize: 14,
                height: 26
              }}
            >
              Same Asset type transfer
            </Box>
          </Box>
          <Stepper
            current={step}
            steps={Object.values(MakeOfferStep).length / 2}
            change={step => setStep(step as MakeOfferStep)}
          />
        </Box>
        {step === MakeOfferStep.Information && (
          <One
            currency={topCurrency}
            chainList={supportChainList}
            onSelectCurrency={onSelectFromCurrency}
            fromChain={fromChain}
            toChain={toChain}
            onSelectFromChain={e => setFromChain(e)}
            onSelectToChain={e => setToChain(e)}
            onSwitch={onSwitch}
            amount={swapAmount}
            onAmount={e => setSwapAmount(e)}
            currencyAmount={fromCurrencyBalance}
            nextBtn={stepNextBtn}
          />
        )}
        {step === MakeOfferStep.Incentive && (
          <Two
            onBack={() => setStep(step - 1)}
            nextBtn={stepNextBtn}
            amount={incentiveAmount}
            onAmount={e => setIncentiveAmount(e)}
            remainingAmount={
              exchangeCurrencyAmount && fromCurrencyBalance
                ? fromCurrencyBalance.subtract(exchangeCurrencyAmount)
                : undefined
            }
            exchangeTokenAmount={exchangeCurrencyAmount}
          />
        )}
        {step === MakeOfferStep.Confirmation && (
          <Three
            exchangeCurrencyAmount={exchangeCurrencyAmount}
            incentiveAmount={incentiveCurrencyAmount}
            onBack={() => setStep(step - 1)}
            toCurrency={toCurrency}
            nextBtn={stepNextBtn}
          />
        )}
      </Card>
    </Box>
  )
}
