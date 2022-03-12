import { useState, useMemo } from 'react'
import Card from 'components/Card'
import { Box, Typography, Grid } from '@mui/material'
// import ActionButton from 'components/Button/ActionButton'
import Divider from 'components/Divider'
import WarningCard, { Subject } from '../WarningCard'
import LogoText from 'components/LogoText'
import { CSSProperties } from 'react'
import TextButton from 'components/Button/TextButton'
import Stepper from './Stepper'
import OutlineButton from 'components/Button/OutlineButton'
import Button from 'components/Button/Button'
import { useHistory, useParams } from 'react-router-dom'
import { OrderStatus, useOrderById } from 'hooks/useFetch'
import ChainLogo from 'components/ChainLogo'
import CurrencyInfo from './CurrencyInfo'
import { useLocalCurrency } from 'hooks/useCurrencyList'
import { getEtherscanLink } from 'utils'
import { OrderTakeSign } from './OrderDetailOperate'
import Spinner from 'components/Spinner'
import { TokenAmount } from 'constants/token'
import { ChainListMap } from 'constants/chain'
import { useActiveWeb3React } from 'hooks'
import { useTokenBalance } from 'state/wallet/hooks'
import { OrderDetailOperate } from './OrderDetailOperate'
import { routes } from 'constants/routes'
import { Timer } from 'components/Timer'

export enum Step {
  Confirm,
  Execute
}

export default function TakeOffer() {
  const { account } = useActiveWeb3React()
  const [step, setStep] = useState(Step.Confirm)
  const { orderId } = useParams<{ orderId: string }>()
  const history = useHistory()
  const [isDeadline, setIsDeadline] = useState(false)

  const { result: orderInfo } = useOrderById(orderId, step)

  const receiveToken = useLocalCurrency(orderInfo?.chain_id, orderInfo?.token_address)
  const payToken = useLocalCurrency(orderInfo?.to_chain_id, orderInfo?.receive_token_address)

  const payTokenAmount = useMemo(() => {
    if (!payToken || !orderInfo?.amount) return undefined
    return new TokenAmount(payToken, orderInfo.amount)
  }, [orderInfo?.amount, payToken])

  const usrBalance = useTokenBalance(account || undefined, payToken)

  const incentiveAmount = useMemo(() => {
    if (!payToken || !orderInfo?.incentive) return undefined
    return new TokenAmount(payToken, orderInfo.incentive)
  }, [orderInfo?.incentive, payToken])

  const completed = useMemo(() => {
    if (!orderInfo) return undefined
    return OrderStatus.Order_Received === orderInfo.status
  }, [orderInfo])

  const getErrorSubText = useMemo(() => {
    return isDeadline ? 'The operation has timed out, please retake offer' : ''
  }, [isDeadline])

  if (!orderInfo)
    return (
      <Box display="flex" justifyContent="center" mt={'200px'}>
        <Spinner size="40px" />
      </Box>
    )

  return (
    <Box pt={68} pb={90} display="grid" gap={20} maxWidth={828} width="100%">
      <Card width="100%" padding="24px 60px 44px">
        <Box display="flex" justifyContent="space-between" mb={32}>
          <Typography fontSize={28} fontWeight={700}>
            {step === Step.Confirm ? 'Take an Offer' : 'Execute Fund'}
          </Typography>
          <Stepper current={step} steps={2} change={step => setStep(step as Step)} />
        </Box>

        {step === Step.Confirm && (
          <>
            <Grid container columnSpacing={20} rowSpacing={8}>
              <Grid item md={6}>
                <Typography fontSize={16} fontWeight={700} mb={16}>
                  You receive
                </Typography>
                <Box
                  width="100%"
                  bgcolor="#F7F7F8"
                  borderRadius="16px"
                  height={60}
                  display="flex"
                  alignItems="center"
                  padding="18px 24px"
                >
                  <ChainLogo chainId={orderInfo.chain_id} size="24px" fontSize="16px" />
                </Box>
              </Grid>
              <Grid item md={6}>
                <Typography fontSize={16} fontWeight={700} mb={16}>
                  You Pay
                </Typography>
                <Box
                  width="100%"
                  bgcolor="#F7F7F8"
                  borderRadius="16px"
                  height={60}
                  display="flex"
                  alignItems="center"
                  padding="18px 24px"
                >
                  <ChainLogo chainId={orderInfo.to_chain_id} size="24px" fontSize="16px" />
                </Box>
              </Grid>
              <Grid item md={6} position="relative">
                <Box
                  width="100%"
                  bgcolor="#F7F7F8"
                  borderRadius="16px"
                  height={108}
                  display="flex"
                  alignItems="center"
                  padding="18px 24px"
                >
                  <CurrencyInfo
                    chainId={orderInfo.chain_id}
                    address={orderInfo.token_address}
                    amount={
                      payTokenAmount && incentiveAmount ? payTokenAmount.add(incentiveAmount).raw.toString() : '-'
                    }
                    textSize={24}
                  />
                </Box>
                <SwitchIcon
                  style={{
                    position: 'absolute',
                    right: -26,
                    zIndex: 1,
                    padding: 0,
                    height: 32,
                    bottom: 38
                  }}
                />
              </Grid>
              <Grid item md={6} position="relative">
                <Box
                  width="100%"
                  bgcolor="#F7F7F8"
                  borderRadius="16px"
                  height={108}
                  display="flex"
                  alignItems="center"
                  padding="18px 24px"
                >
                  <CurrencyInfo
                    chainId={orderInfo.to_chain_id}
                    address={orderInfo.receive_token_address}
                    amount={orderInfo.amount}
                    textSize={24}
                  />
                </Box>
              </Grid>
              <Grid item md={6}>
                <Typography fontSize={11} sx={{ opacity: 0.5 }}>
                  {payTokenAmount?.toSignificant(6, { groupSeparator: ',' })}BTC (You recive) +{' '}
                  {incentiveAmount?.toSignificant(6, { groupSeparator: ',' })}BTC (Offer Incentive)
                </Typography>
              </Grid>
            </Grid>

            <Divider style={{ marginTop: 48, marginBottom: 24 }} extension={60} />

            <Grid container columnSpacing={24} rowSpacing={16} mb={32}>
              <Grid item md={6}>
                <Box display="flex" justifyContent="space-between">
                  <Typography fontSize={16} fontWeight={700}>
                    Token Information
                  </Typography>
                  <TextButton
                    underline
                    onClick={() => {
                      receiveToken &&
                        window.open(getEtherscanLink(receiveToken?.chainId, receiveToken?.address, 'token'))
                    }}
                    primary
                    fontSize={12}
                    opacity={0.5}
                  >
                    View on explorer
                  </TextButton>
                </Box>
              </Grid>
              <Grid item md={6}>
                <Box display="flex" justifyContent="flex-end">
                  <TextButton
                    underline
                    onClick={() => {
                      payToken && window.open(getEtherscanLink(payToken?.chainId, payToken?.address, 'token'))
                    }}
                    primary
                    fontSize={12}
                    opacity={0.5}
                  >
                    View on explorer
                  </TextButton>
                </Box>
              </Grid>
              <Grid item md={6} position="relative">
                <Box
                  width="100%"
                  bgcolor="#F7F7F8"
                  borderRadius="16px"
                  height={88}
                  display="grid"
                  gap={13}
                  padding="18px 24px"
                >
                  <LogoText
                    logo={receiveToken?.logo || ''}
                    text={`${receiveToken?.name}(${receiveToken?.symbol})`}
                    fontSize={16}
                    size="24px"
                  />
                  <Typography fontSize={12} sx={{ opacity: 0.5 }}>
                    {receiveToken?.address}
                  </Typography>
                </Box>
              </Grid>

              <Grid item md={6} position="relative">
                <Box
                  width="100%"
                  bgcolor="#F7F7F8"
                  borderRadius="16px"
                  height={88}
                  display="grid"
                  gap={13}
                  padding="18px 24px"
                >
                  <LogoText
                    logo={payToken?.logo || ''}
                    text={`${payToken?.name}(${payToken?.symbol})`}
                    fontSize={16}
                    size="24px"
                  />
                  <Typography fontSize={12} sx={{ opacity: 0.5 }}>
                    {payToken?.address}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <OrderTakeSign
              order={orderInfo}
              next={() => {
                setStep(Step.Execute)
                setIsDeadline(false)
              }}
            />
          </>
        )}
        {step === Step.Execute && (
          <>
            <Typography mb={16}>
              <b>1. Send.</b> You need to send {payTokenAmount?.toSignificant(6, { groupSeparator: ',' })}{' '}
              {payToken?.symbol} to the requester on {ChainListMap[orderInfo.to_chain_id].name}
            </Typography>
            <Box
              border="1px solid rgba(66, 63, 71, 0.2)"
              borderRadius="16px"
              width="100%"
              height={60}
              pl="24px"
              display="flex"
              alignItems="center"
              mb={24}
            >
              <Typography fontSize={16} fontWeight={500}>
                Please the operation within{' '}
                {completed ? (
                  '-'
                ) : (
                  <span style={{ color: 'red' }}>
                    <Timer
                      onlyNumber
                      timer={orderInfo.Deadline}
                      onZero={() => setIsDeadline(true)}
                      onHeartbeat={val => {
                        if (val) {
                          setIsDeadline(false)
                        } else {
                          setIsDeadline(true)
                        }
                      }}
                    />
                  </span>
                )}{' '}
                , otherwise the order will be invalid
              </Typography>
            </Box>
            <Box
              width="100%"
              height={108}
              bgcolor="#F7F7F8"
              pl={24}
              display="flex"
              alignItems="center"
              mb={32}
              borderRadius="16px"
            >
              <Box display="flex" alignItems="flex-end">
                <LogoText
                  logo={payToken?.logo || ''}
                  text={`${usrBalance?.toSignificant(6, { groupSeparator: ',' }) || '-'} ${payToken?.symbol}`}
                  fontSize={24}
                  size="32px"
                  gapSize={12}
                />
                /
                <LogoText
                  logo={payToken?.logo || ''}
                  text={`${payTokenAmount?.toSignificant(6, { groupSeparator: ',' })} ${payToken?.symbol}`}
                  fontSize={12}
                  size="14px"
                  gapSize={4}
                />
              </Box>
            </Box>
            {/* <ActionButton
              actionText="Execute"
              onAction={getExecuteAction}
              borderRadius="16px"
              pending={false}
              pendingText={'Pending'}
              // error={'Try Again'}
              errorSubText={getErrorSubText}
              onErrorAction={getExecuteAction}
            /> */}
            <OrderDetailOperate order={orderInfo} again={!!getErrorSubText} />
            <Typography fontSize={11} color="#FF0000" mt={12}>
              {getErrorSubText}
            </Typography>
            <Divider style={{ marginTop: 48, marginBottom: 24 }} extension={60} />
            <Box sx={{ position: 'relative', opacity: completed ? 1 : 0.5 }}>
              {!completed && (
                <Box
                  sx={{
                    position: 'absolute',
                    zIndex: 1,
                    height: '100%',
                    width: '100%'
                  }}
                />
              )}
              <Typography>
                <b>2. Finish.</b> Please go to your account to view the profit and details of this transaction
              </Typography>
              <Box display="flex" alignItems="center" gap={20} mt={32}>
                <OutlineButton onClick={() => history.goBack()} primary>
                  Cancel
                </OutlineButton>
                <Button onClick={() => history.replace(routes.account)} borderRadius="16px">
                  Go to My Account
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Card>
      {step === Step.Confirm && <WarningCard subject={Subject.TakeOffer} />}
    </Box>
  )
}

function SwitchIcon({ style }: { style: CSSProperties }) {
  return (
    <svg style={style} width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="black" />
      <path
        d="M17.6194 10.0005C17.4525 9.99462 17.288 10.0451 17.1491 10.1447C17.0103 10.2443 16.904 10.3881 16.8453 10.5559C16.7865 10.7236 16.7783 10.9069 16.8217 11.0799C16.8651 11.253 16.9579 11.4071 17.0872 11.5206L21.0406 15.1517H8.81681C8.7104 15.1492 8.60459 15.1694 8.50559 15.2114C8.4066 15.2533 8.31642 15.3161 8.24033 15.396C8.16425 15.4758 8.1038 15.5711 8.06253 15.6763C8.02126 15.7816 8 15.8945 8 16.0087C8 16.1229 8.02126 16.2359 8.06253 16.3412C8.1038 16.4464 8.16425 16.5417 8.24033 16.6215C8.31642 16.7014 8.4066 16.7642 8.50559 16.8061C8.60459 16.8481 8.7104 16.8683 8.81681 16.8658H23.2054C23.3678 16.8647 23.5261 16.8105 23.6591 16.7104C23.7921 16.6103 23.8935 16.4692 23.9498 16.3057C24.0061 16.1422 24.0146 15.9641 23.9742 15.7954C23.9337 15.6266 23.8463 15.475 23.7235 15.3609L18.1314 10.2165C17.9899 10.0817 17.8085 10.0052 17.6194 10.0005Z"
        fill="white"
      />
      <path
        d="M23.206 15.145C23.3685 15.1461 23.5268 15.2003 23.6598 15.3004C23.7928 15.4005 23.8942 15.5418 23.9505 15.7053C24.0068 15.8687 24.0153 16.0467 23.9749 16.2155C23.9344 16.3843 23.847 16.5358 23.7242 16.65L18.1258 21.7944C18.046 21.8675 17.9535 21.9229 17.8537 21.9577C17.7538 21.9924 17.6486 22.0058 17.544 21.9969C17.4393 21.9881 17.3373 21.9572 17.2438 21.9061C17.1503 21.8549 17.0671 21.7846 16.9989 21.699C16.9308 21.6133 16.879 21.5141 16.8466 21.407C16.8142 21.2999 16.8018 21.1871 16.81 21.0748C16.8183 20.9626 16.8471 20.8532 16.8948 20.7529C16.9425 20.6525 17.0081 20.5634 17.0879 20.4903L21.0397 16.8592H8.8175C8.71104 16.8618 8.60516 16.8416 8.50608 16.7997C8.40701 16.7577 8.31675 16.695 8.24059 16.6152C8.16444 16.5353 8.10393 16.44 8.06261 16.3347C8.0213 16.2294 8.00002 16.1164 8.00002 16.0021C8.00002 15.8879 8.0213 15.7747 8.06261 15.6695C8.10393 15.5642 8.16444 15.4688 8.24059 15.389C8.31675 15.3091 8.40701 15.2464 8.50608 15.2045C8.60516 15.1626 8.71104 15.1424 8.8175 15.145H23.206Z"
        fill="white"
      />
    </svg>
  )
}
