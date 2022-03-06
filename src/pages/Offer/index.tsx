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
import { useCurrencyListByChain } from 'hooks/useCurrencyList'
import { useCreateOrderCallback } from 'hooks/useCreateOrderCallback'
import TransactionPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import { tryParseAmount } from 'utils/parseAmount'
import { useActiveWeb3React } from 'hooks'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import { useWalletModalToggle } from 'state/application/hooks'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { MATCHING_ADDRESS } from '../../constants'
import { Token } from 'constants/token'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { triggerSwitchChain } from 'utils/triggerSwitchChain'
import { useMinIncentive, useReceiveValue } from 'hooks/useIncentive'

enum ERROR {
  SELECT_CHAIN = 'Select Chain',
  SELECT_ASSET = 'Select Asset',
  ENTER_AMOUNT = 'Enter Amount'
}

export default function Offer() {
  const { account, chainId, library } = useActiveWeb3React()
  const [fromChain, setFromChain] = useState<Chain | null>(null)
  const [toChain, setToChain] = useState<Chain | null>(null)
  const [fromCurrency, setFromCurrency] = useState<Currency | null>(null)
  const [toCurrency, setToCurrency] = useState<Currency | null>(null)
  const [fromValue, setFromValue] = useState('')
  // const [toValue, setToValue] = useState('-')
  const [incentive, setIncentive] = useState('')
  const { showModal, hideModal } = useModal()
  const toggleWalletModal = useWalletModalToggle()

  const updateIncentive = useCallback((val: string) => {
    setIncentive(val)
  }, [])

  const minIncentive = useMinIncentive(incentive, updateIncentive, fromCurrency || undefined, fromValue)
  const receiveValue = useReceiveValue(fromCurrency || undefined, fromValue, incentive)

  const chainList = ChainList.filter(i => [42, 97].indexOf(i.id) !== -1)
  const fromCurrencyList: Currency[] = useCurrencyListByChain(fromChain?.id)
  const toCurrencyList: Currency[] = useCurrencyListByChain(toChain?.id)

  const onSelectFromCurrency = useCallback(() => {
    fromCurrencyList.length &&
      showModal(
        <SelectCurrencyModal
          onSelectCurrency={currency => {
            setFromCurrency(currency)
          }}
          tokenList={fromCurrencyList}
        />
      )
  }, [fromCurrencyList, showModal])

  const onSelectToCurrency = useCallback(() => {
    toCurrencyList.length &&
      showModal(
        <SelectCurrencyModal
          onSelectCurrency={currency => {
            setToCurrency(currency)
          }}
          tokenList={toCurrencyList}
        />
      )
  }, [toCurrencyList, showModal])

  const exchangeTokenAmount = useMemo(() => tryParseAmount(fromValue, fromCurrency || undefined), [
    fromCurrency,
    fromValue
  ])
  const fromBalance = useCurrencyBalance(account || undefined, fromCurrency || undefined)

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

  const createOrderCallback = useCreateOrderCallback()
  const onCreateOrderCallback = useCallback(() => {
    if (!fromCurrency || !toChain || !toChain.id || !account || !minIncentive) return
    if (!(fromCurrency instanceof Token)) {
      return
    }
    const _amount = tryParseAmount(fromValue, fromCurrency)
    if (!_amount) return
    showModal(<TransactionPendingModal />)
    createOrderCallback(fromCurrency.address, account, _amount.raw.toString(), minIncentive, toChain.id)
      .then(() => {
        hideModal()
        showModal(<TransactionSubmittedModal />)
      })
      .catch((err: any) => {
        hideModal()
        showModal(
          <MessageBox type="error">{err.error && err.error.message ? err.error.message : err?.message}</MessageBox>
        )
        console.error(err)
      })
  }, [fromCurrency, toChain, account, fromValue, minIncentive, showModal, createOrderCallback, hideModal])

  const [approvalState, approvalCallback] = useApproveCallback(
    exchangeTokenAmount,
    chainId ? MATCHING_ADDRESS[chainId] : undefined
  )

  const getAction: {
    error?: string
    msg: string
    event?: () => void
  } = useMemo(() => {
    if (!fromChain?.id || !toChain?.id) {
      return {
        error: ERROR.SELECT_CHAIN,
        msg: ''
      }
    }

    if (!fromCurrency || !toCurrency) {
      return {
        error: ERROR.SELECT_ASSET,
        msg: ''
      }
    }

    if (!fromValue || !incentive) {
      return { error: ERROR.ENTER_AMOUNT, msg: '' }
    }

    if (!account || !library) {
      return {
        msg: 'Connect wallet',
        event: toggleWalletModal
      }
    }

    if (chainId !== fromChain.id) {
      return {
        msg: 'Switch',
        event: () => fromChain.id && triggerSwitchChain(library, fromChain.id, account)
      }
    }

    if (!fromBalance || !exchangeTokenAmount || fromBalance.lessThan(exchangeTokenAmount)) {
      return {
        error: 'Balance Insufficient',
        msg: ''
      }
    }

    if (approvalState !== ApprovalState.APPROVED) {
      if (approvalState === ApprovalState.PENDING) {
        return {
          msg: 'Approving...',
          event: toggleWalletModal
        }
      } else if (approvalState === ApprovalState.NOT_APPROVED) {
        return {
          msg: 'Approval',
          event: approvalCallback
        }
      } else {
        return {
          error: 'Loading',
          msg: ''
        }
      }
    }

    return {
      msg: 'Make an Offer',
      event: onCreateOrderCallback
    }
  }, [
    fromChain,
    incentive,
    toChain,
    fromCurrency,
    toCurrency,
    fromValue,
    account,
    library,
    chainId,
    fromBalance,
    exchangeTokenAmount,
    approvalState,
    onCreateOrderCallback,
    toggleWalletModal,
    approvalCallback
  ])

  return (
    <Box pt={68} display="grid" gap={20} maxWidth={828} width="100%">
      <Card width="100%" padding="24px 60px 44px">
        <LogoText logo={OfferIcon} text=" Make an Offer" size="32px" fontSize={36} fontWeight={700} />
        <Box mt={32}>
          <BiSwap
            fromLabel={"You'll send"}
            toLabel={"You'll receive"}
            fromChain={fromChain}
            fromCurrency={fromCurrency}
            fromValue={fromValue}
            toChain={toChain}
            toCurrency={toCurrency}
            toValue={receiveValue?.toSignificant(6, { groupSeparator: ',' }) || '-'}
            chainList={chainList}
            onSelectFromChain={setFromChain}
            onSelectToChain={setToChain}
            onSelectFromCurrency={onSelectFromCurrency}
            onSelectToCurrency={onSelectToCurrency}
            onChangeFromValue={e => setFromValue(e.target.value)}
            onChangeToValue={() => {}}
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

        <ActionButton error={getAction.error} actionText={getAction.msg} onAction={getAction.event} />
      </Card>
      <WarningCard />
    </Box>
  )
}
