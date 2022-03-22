import { useState, useMemo, useCallback } from 'react'
import Card from 'components/Card'
import { Typography, Box } from '@mui/material'
import RoundTabs from 'components/Tabs/RoundTabs'
import LogoText from 'components/LogoText'
import Table from 'components/Table'
import CurrencyText from 'components/CurrencyText'
import ComposedText from 'components/ComposedText'
import Button from 'components/Button/Button'
import StatusTag from 'components/StatusTag'
import OutlineButton from 'components/Button/OutlineButton'
import Pagination from 'components/Pagination'
import { useAccountTotalValue } from 'hooks/useAccountInfo'
import { AccountWithdrawStatus, useAccountWalletInformation, useAccountWithdrawList } from 'hooks/useFetch'
import ChainLogo from 'components/ChainLogo'
import { ChainList, ChainListMap } from 'constants/chain'
import Spinner from 'components/Spinner'
import { useWalletWithdrawCallback } from 'hooks/useWalletWithdraw'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import useModal from 'hooks/useModal'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import TransactionPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import { useActiveWeb3React } from 'hooks'
import { Currency, CurrencyAmount, TokenAmount } from 'constants/token'
import { triggerSwitchChain } from 'utils/triggerSwitchChain'
import { useTagCompletedTx } from 'state/transactions/hooks'
import { Dots } from 'theme/components'
import { getEtherscanLink } from 'utils'
import NoData from 'components/NoData'

const WalletInfoTableHeader = ['Asset', 'Amount']
const WithdrawlHistoryTableHeader = ['Date', 'Amount', 'Status']

export default function Dashboard() {
  const accountTotalValue = useAccountTotalValue()
  const [walletInfoTab, setWalletInfoTab] = useState(0)
  const [historyTab, setHistoryTab] = useState(0)
  const { showModal, hideModal } = useModal()
  const { loading: walletInfoLoading, list: walletInfoList } = useAccountWalletInformation(ChainList[walletInfoTab].id)
  const { loading: historyLoading, list: historyList, page: historyPage } = useAccountWithdrawList(
    ChainList[historyTab].id
  )

  const walletInfoTabs = useMemo(() => {
    return ChainList.map(item => <ChainLogo key={item.id} chainId={item.id} size="16px" />)
  }, [])

  const { getWithdrawSign, withdrawCallback } = useWalletWithdrawCallback()

  const onWithdraw = useCallback(
    async (tokenAddress: string) => {
      showModal(<TransactionPendingModal />)
      try {
        const data = await getWithdrawSign(tokenAddress)
        if (!data) {
          showModal(<MessageBox type="error">get sign error</MessageBox>)
          return
        }
        withdrawCallback(data, tokenAddress)
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
      } catch (error) {
        console.error(error)
        showModal(<MessageBox type="error">get sign error</MessageBox>)
      }
    },
    [getWithdrawSign, hideModal, showModal, withdrawCallback]
  )

  const walletInfoDataRows = useMemo(
    () =>
      walletInfoList.map(item => [
        item.currency ? (
          <CurrencyText
            key={0}
            currency={item.currency}
            currencySize={'32px'}
            text={item.currency.symbol || ''}
            subText={item.currency.name || ''}
            textSize={16}
            subTextSize={12}
          />
        ) : (
          '-'
        ),
        <ComposedText
          key={0}
          text={item?.currencyAmount?.toSignificant(6, { groupSeparator: ',' }) || '-'}
          subText=""
          textSize={16}
          subTextSize={13}
          textOpacity={1}
        />,
        <WithdrawButton onWithdraw={onWithdraw} key={1} currency={item.currency} currencyAmount={item.currencyAmount} />
      ]),
    [onWithdraw, walletInfoList]
  )

  const withdrawHistoryDataRows = useMemo(() => {
    return historyList.map(item => [
      <Typography key={0} fontSize={16}>
        {new Date(item.createdAt * 1000).toLocaleString()}
      </Typography>,
      <LogoText
        key={0}
        logo={item.currency?.logo || ''}
        text={`${item.currencyAmount?.toSignificant(6, { groupSeparator: ',' })} ${item.currency?.symbol}`}
      />,
      <StatusTag key={0} type={item.status === AccountWithdrawStatus.complete ? 'complete' : 'pending'} />,
      <OutlineButton
        key={0}
        onClick={() => {
          window.open(getEtherscanLink(ChainList[historyTab].id, item.hash, 'transaction'))
        }}
        width={84}
        height={36}
        fontSize={13}
        primary
      >
        Details
      </OutlineButton>
    ])
  }, [historyList, historyTab])

  return (
    <Box display="grid" gap={24}>
      <Card width={980} padding="30px 28px">
        <Typography fontSize={16} fontWeight={500} mb={28}>
          My Balance
        </Typography>
        <Box display="flex" gap={12} alignItems="center">
          <Typography fontSize={32} fontWeight={700}>
            $ {accountTotalValue ? accountTotalValue.toFixed(2) : '-'}
          </Typography>
          {/* <Box
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
          </Box> */}
        </Box>
      </Card>
      <Card width={980} padding="30px 28px">
        <Typography fontSize={16} fontWeight={500} mb={28}>
          Wallet Information
        </Typography>
        <RoundTabs titles={walletInfoTabs} current={walletInfoTab} onChange={setWalletInfoTab} />
        <Table fontSize="12px" header={WalletInfoTableHeader} rows={walletInfoDataRows} variant="outlined" />
        {walletInfoLoading && (
          <Box display="flex" pt={20} pb={20} justifyContent="center">
            <Spinner size="40px" />
          </Box>
        )}
        {!walletInfoLoading && !walletInfoDataRows.length && (
          <Box display="flex" pt={20} pb={20} justifyContent="center">
            No data
          </Box>
        )}
      </Card>
      <Card width={980} padding="30px 28px">
        <Typography fontSize={16} fontWeight={500} mb={28}>
          Withdraw History
        </Typography>
        <Box display="grid" gap={40}>
          <RoundTabs titles={walletInfoTabs} current={historyTab} onChange={setHistoryTab} />
          <Table
            fontSize="12px"
            header={WithdrawlHistoryTableHeader}
            rows={withdrawHistoryDataRows}
            variant="outlined"
          />
          {historyLoading && (
            <Box display="flex" pt={20} pb={20} justifyContent="center">
              <Spinner size="40px" />
            </Box>
          )}
          {!historyLoading && !historyList.length && <NoData />}
          <Pagination
            count={historyPage.totalPages}
            page={historyPage.page}
            boundaryCount={0}
            onChange={(_, value) => historyPage.setPage(value)}
          />
        </Box>
      </Card>
    </Box>
  )
}

function WithdrawButton({
  currencyAmount,
  currency,
  onWithdraw
}: {
  currencyAmount: TokenAmount | undefined | CurrencyAmount
  currency: Currency | undefined
  onWithdraw: (tokenAddress: string) => Promise<void>
}) {
  const { account, chainId, library } = useActiveWeb3React()

  const isCompletedTx = useTagCompletedTx('withdraw', currency?.address || '')

  if (!account || !chainId || !library || !currencyAmount || !currency || !currency.chainId) return null

  if (chainId !== currency.chainId) {
    return (
      <Button
        onClick={() => currency.chainId && triggerSwitchChain(library, currency.chainId, account)}
        height="36px"
        width="auto"
        style={{ padding: '0 10px' }}
        fontSize={13}
      >
        Switch to {ChainListMap[currency.chainId].symbol}
      </Button>
    )
  }

  if (isCompletedTx === false) {
    return (
      <Button disabled width="112px" height="36px" fontSize={13}>
        Withdrawing
        <Dots />
      </Button>
    )
  }

  if (isCompletedTx === true) {
    return (
      <Button disabled width="112px" height="36px" fontSize={13}>
        Withdrew
      </Button>
    )
  }

  return (
    <Button
      onClick={() => {
        if (!currency.address) return
        onWithdraw(currency.address)
      }}
      width="112px"
      height="36px"
      fontSize={13}
    >
      Withdraw
    </Button>
  )
}
