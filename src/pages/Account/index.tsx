import { Box, Grid, Typography, useTheme } from '@mui/material'
import LogoText from 'components/LogoText'
import AccountIcon from 'assets/images/account-lg.png'
import LiveOffer from './LiveOffer'
import LiveTaskList from './LiveTaskList'
import { useHistory } from 'react-router-dom'
import { routes } from 'constants/routes'
import Card from 'components/Card'
import RoundTabs from 'components/Tabs/RoundTabs'
import { ChainList } from 'constants/chain'
import { useCallback, useMemo, useState } from 'react'
import ChainLogo from 'components/ChainLogo'
import { useAccountWalletInformation } from 'hooks/useFetch'
import { useAccountTotalValue } from 'hooks/useAccountInfo'
import Spinner from 'components/Spinner'
import NoData from 'components/NoData'
import { AccountWithdrawButton } from './Dashboard'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import useModal from 'hooks/useModal'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import TransactionPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import { useWalletWithdrawCallback } from 'hooks/useWalletWithdraw'
import CurrencyLogo from 'components/essential/CurrencyLogo'

export default function Account() {
  const theme = useTheme()
  const history = useHistory()
  const [historyTab, setHistoryTab] = useState(0)
  const accountTotalValue = useAccountTotalValue()
  const { showModal, hideModal } = useModal()

  const walletInfoTabs = useMemo(() => {
    return ChainList.map(item => <ChainLogo gapSize="6px" key={item.id} chainId={item.id} size="16px" />)
  }, [])

  const { loading: walletInfoLoading, list: walletInfoList } = useAccountWalletInformation(ChainList[historyTab].id)

  const { getWithdrawSign, withdrawCallback } = useWalletWithdrawCallback()

  const onWithdraw = useCallback(
    async (tokenAddress: string) => {
      showModal(<TransactionPendingModal />)
      try {
        const data = await getWithdrawSign(tokenAddress)
        if (!data) {
          showModal(<MessageBox type="error">Get sign error</MessageBox>)
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
        showModal(<MessageBox type="error">Get sign error</MessageBox>)
      }
    },
    [getWithdrawSign, hideModal, showModal, withdrawCallback]
  )

  return (
    <>
      <Box maxWidth="980px" width="100%" pt={60} pb={94} display="grid" gap={40}>
        <Box width="100%" display="flex" justifyContent="space-between" mb={40} alignItems="center">
          <LogoText logo={AccountIcon} text="Account" size="32px" fontSize={36} fontWeight={700} />
          <Typography
            onClick={() => history.push(routes.accountHistory)}
            sx={{ cursor: 'pointer', '&:hover': { color: theme.palette.primary.main } }}
            fontWeight={500}
            fontSize={20}
            color={theme.palette.primary.light}
          >
            {'History'}
          </Typography>
        </Box>
        <Box>
          <Typography fontSize={16} fontWeight={500} mb={20} ml={20}>
            My Available Withdraw
          </Typography>
          <Card width={980} padding="30px 28px">
            <Box display={'flex'} justifyContent="space-between" alignItems={'center'} mb={25}>
              <RoundTabs minHeight={40} titles={walletInfoTabs} current={historyTab} onChange={setHistoryTab} />
              <Typography>Balance Worth: $ {accountTotalValue ? accountTotalValue.toFixed(2) : '-'}</Typography>
            </Box>
            {walletInfoLoading && (
              <Box display="flex" pt={20} pb={20} justifyContent="center">
                <Spinner size="40px" />
              </Box>
            )}
            {!walletInfoLoading && !walletInfoList.length ? (
              <NoData />
            ) : (
              <Grid container spacing={15}>
                {walletInfoList.map((item, index) => (
                  <Grid item key={index} md={4} xs={12}>
                    <Box
                      sx={{ border: '1px solid #000000', height: 60, padding: '14px', borderRadius: '16px' }}
                      display="flex"
                      justifyContent={'space-between'}
                      alignItems="center"
                    >
                      <Box display={'flex'} gap="8px">
                        <CurrencyLogo size="18px" currency={item.currency} />
                        <Typography fontWeight={500} color={theme.palette.primary.main}>
                          {item.currencyAmount?.toSignificant(6)} {item.currency?.symbol}
                        </Typography>
                      </Box>
                      <AccountWithdrawButton
                        onWithdraw={onWithdraw}
                        height="34px"
                        currency={item.currency}
                        currencyAmount={item.currencyAmount}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
          </Card>
        </Box>
        <LiveOffer />
        <LiveTaskList />
      </Box>
    </>
  )
}
