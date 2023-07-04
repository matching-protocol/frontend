import { useState, useMemo, useEffect } from 'react'
import Card from 'components/Card'
import { Box, Typography, useTheme } from '@mui/material'
// import ActionButton from 'components/Button/ActionButton'
import WarningCard, { Subject } from '../WarningCard'
import LogoText from 'components/LogoText'
import Stepper from './Stepper'
import { useHistory, useParams } from 'react-router-dom'
import { useOrderById } from 'hooks/useFetch'
import { OrderStatus } from 'hooks/useFetchOrderList'
import { getEtherscanLink } from 'utils'
import { OrderTakeSign } from './OrderDetailOperate'
import Spinner from 'components/Spinner'
import { CurrencyAmount, Token, TokenAmount } from 'constants/token'
import { ChainListMap } from 'constants/chain'
import { OrderDetailOperate } from './OrderDetailOperate'
import { routes } from 'constants/routes'
import { Timer, getDeltaTime } from 'components/Timer'
import { useLocalCurrency } from 'state/token/hooks'
import { useTagCompletedTx } from 'state/transactions/hooks'
import OutlineButton from 'components/Button/OutlineButton'
import { CircleSvg, ShowChain } from 'pages/SameMakeOffer/Three'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { ExternalLink } from 'theme/components'
import JSBI from 'jsbi'

export enum Step {
  Confirm,
  Execute
}

export default function TakeOffer() {
  const [step, setStep] = useState(Step.Confirm)
  const { orderId } = useParams<{ orderId: string }>()
  const history = useHistory()
  const theme = useTheme()
  const [isDeadline, setIsDeadline] = useState(false)

  const { result: orderInfo } = useOrderById(orderId, step)

  const receiveToken = useLocalCurrency(orderInfo?.chain_id, orderInfo?.token_address)
  const payCurrency = useLocalCurrency(orderInfo?.to_chain_id, orderInfo?.receive_token_address)

  const payCurrencyAmount = useMemo(() => {
    if (!payCurrency || !orderInfo?.amount) return undefined
    const _amount = JSBI.subtract(JSBI.BigInt(orderInfo.amount), JSBI.BigInt(orderInfo.incentive))
    if (payCurrency instanceof Token) return new TokenAmount(payCurrency, _amount)
    else return CurrencyAmount.getEther(payCurrency, _amount)
  }, [orderInfo?.amount, orderInfo?.incentive, payCurrency])

  // const truePayCurrency = useMemo(() => {
  //   if (payCurrency instanceof Token) return payCurrency
  //   return ETHER
  // }, [payCurrency])

  const incentiveAmount = useMemo(() => {
    if (!payCurrency || !orderInfo?.incentive) return undefined
    if (payCurrency instanceof Token) return new TokenAmount(payCurrency, orderInfo.incentive)
    else return CurrencyAmount.getEther(payCurrency, orderInfo.incentive)
  }, [orderInfo?.incentive, payCurrency])

  const tokenSymbol = useMemo(() => payCurrency?.symbol, [payCurrency])

  const completed = useMemo(() => {
    if (!orderInfo) return undefined
    return OrderStatus.Status_received === orderInfo.status
  }, [orderInfo])

  const getErrorSubText = useMemo(() => {
    return isDeadline && orderInfo?.Deadline !== undefined ? 'The operation has timed out, please retake offer' : ''
  }, [isDeadline, orderInfo?.Deadline])

  const isContractCompleted = useTagCompletedTx('take', orderInfo?.global_order_id.toString())

  useEffect(() => {
    if (isContractCompleted) {
      setIsDeadline(false)
    }
  }, [isContractCompleted])

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
            {step === Step.Confirm ? 'Offer Confirmation' : 'Execute Fund'}
          </Typography>
          <Stepper current={step} steps={2} change={step => setStep(step as Step)} />
        </Box>

        {step === Step.Confirm && (
          <>
            <Box
              sx={{
                backgroundColor: '#F7F7F8',
                borderRadius: '16px',
                padding: 40,
                marginBottom: 32
              }}
            >
              <Box display="flex" justifyContent={'space-between'} sx={{ paddingLeft: '5%' }}>
                <Box display="grid" gridTemplateColumns={'120px 1fr'}>
                  <Box display={'flex'} gap="10px" alignItems={'center'}>
                    <CircleSvg />
                    <Box
                      sx={{
                        border: `1px solid ${theme.palette.primary.main}`,
                        borderRadius: '3px',
                        padding: '0 5px'
                      }}
                    >
                      <Typography fontSize={12} color={theme.palette.primary.main}>
                        You receive
                      </Typography>
                    </Box>
                  </Box>
                  <Box display={'flex'} alignItems="center" gap="5px">
                    <CurrencyLogo currency={receiveToken} />
                    <Typography fontSize={18} fontWeight={700}>
                      {incentiveAmount &&
                        payCurrencyAmount &&
                        payCurrencyAmount.add(incentiveAmount).toSignificant(6, { groupSeparator: ',' })}{' '}
                      {tokenSymbol}
                    </Typography>
                    <Typography fontSize={12} color={'#1F191B'}>
                      / <ShowChain chainId={orderInfo.chain_id} />
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <ExternalLink
                    href={getEtherscanLink(orderInfo.chain_id, receiveToken?.address || '', 'token')}
                    underline="none"
                    sx={{
                      fontWeight: 500,
                      fontSize: 12,
                      color: theme.palette.primary.light,
                      borderBottom: '1px solid rgba(22, 22, 22, 0.4)'
                    }}
                  >
                    View on <ShowChain chainId={orderInfo.chain_id} />
                  </ExternalLink>
                </Box>
              </Box>
              <Box display="flex" justifyContent={'space-between'} margin="5px 0" sx={{ paddingLeft: '5%' }}>
                <Box display="grid" gridTemplateColumns={'120px 1fr'}>
                  <Box sx={{ borderLeft: '2px dotted #000', marginLeft: 8 }}></Box>
                  <Box height={90}>
                    <Typography fontSize={12} color="#1F191B" fontWeight={500}>
                      {payCurrencyAmount?.toSignificant(6, { groupSeparator: ',' })}
                      {tokenSymbol}(You receive)
                    </Typography>
                    <Typography fontSize={12} color="#1F191B" fontWeight={500}>
                      {incentiveAmount?.toSignificant(6, { groupSeparator: ',' })}
                      {tokenSymbol}(Offer Incentive)
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box display="flex" justifyContent={'space-between'} sx={{ paddingLeft: '5%' }}>
                <Box display="grid" gridTemplateColumns={'120px 1fr'}>
                  <Box display={'flex'} gap="10px" alignItems={'center'}>
                    <CircleSvg stroke="#FF9800" />
                    <Box
                      sx={{
                        border: `1px solid ${theme.palette.primary.main}`,
                        borderRadius: '3px',
                        padding: '0 5px'
                      }}
                    >
                      <Typography fontSize={12} color={theme.palette.primary.main}>
                        You Pay
                      </Typography>
                    </Box>
                  </Box>
                  <Box display={'flex'} alignItems="center" gap="5px">
                    <CurrencyLogo currency={payCurrencyAmount?.currency} />
                    <Typography fontSize={18} fontWeight={700}>
                      {payCurrencyAmount?.toSignificant(6, { groupSeparator: ',' })} {tokenSymbol}
                    </Typography>
                    <Typography fontSize={12} color={'#1F191B'}>
                      / <ShowChain chainId={orderInfo.to_chain_id} />
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <ExternalLink
                    href={getEtherscanLink(orderInfo.to_chain_id || 1, payCurrency?.address || '', 'token')}
                    underline="none"
                    sx={{
                      fontWeight: 500,
                      fontSize: 12,
                      color: theme.palette.primary.light,
                      borderBottom: '1px solid rgba(22, 22, 22, 0.4)'
                    }}
                  >
                    View on <ShowChain chainId={orderInfo.to_chain_id} />
                  </ExternalLink>
                </Box>
              </Box>
            </Box>

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
              <b>1. Send.</b> You need to send{' '}
              <b>
                {payCurrencyAmount?.toSignificant(6, { groupSeparator: ',' })} {payCurrency?.symbol}
              </b>{' '}
              to the requester on {ChainListMap[orderInfo.to_chain_id].name}
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
                Please complete the operation within{' '}
                {completed || isContractCompleted === true ? (
                  '-'
                ) : (
                  <span style={{ color: 'red' }}>
                    <Timer
                      onlyNumber
                      timer={orderInfo.Deadline}
                      onZero={() => {}}
                      onHeartbeat={val => {
                        if (val) {
                          setIsDeadline(false)
                        } else if (orderInfo.Deadline && !getDeltaTime(orderInfo.Deadline)) {
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
              gap={50}
              borderRadius="16px"
            >
              <Box mt={-5}>
                <Typography mb={10} fontWeight={700} color={theme.palette.primary.light}>
                  Chain
                </Typography>
                <LogoText
                  logo={ChainListMap[payCurrency?.chainId || 1].logo}
                  text={`${ChainListMap[payCurrency?.chainId || 1].symbol}`}
                  fontSize={24}
                  size="32px"
                  gapSize={12}
                />
              </Box>
              <Box mt={-5}>
                <Typography mb={10} fontWeight={700} color={theme.palette.primary.light}>
                  Amount
                </Typography>
                <LogoText
                  logo={payCurrency?.logo || ''}
                  text={`${payCurrencyAmount?.toSignificant(6, { groupSeparator: ',' })} ${payCurrency?.symbol}`}
                  fontSize={24}
                  size="32px"
                  gapSize={12}
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
            <OrderDetailOperate
              order={orderInfo}
              again={!!getErrorSubText}
              next={() => {
                setIsDeadline(false)
              }}
            />
            <Typography fontSize={11} color="#FF0000" mt={12}>
              {getErrorSubText}
            </Typography>
            <Typography mt={32} fontWeight={700} color={theme.palette.primary.light}>
              You will be credited{' '}
              <span style={{ color: theme.palette.primary.main }}>
                {`${payCurrencyAmount &&
                  incentiveAmount &&
                  payCurrencyAmount.add(incentiveAmount).toSignificant(6, { groupSeparator: ',' })} ${
                  payCurrency?.symbol
                }`}{' '}
              </span>
              from requester deposit on{' '}
              <span style={{ color: theme.palette.primary.main }}>{ChainListMap[receiveToken?.chainId || 1].name}</span>
              . Please visit account to claim your tokens
            </Typography>
            <Box sx={{ position: 'relative', opacity: completed || isContractCompleted ? 1 : 0.5 }}>
              {!completed && isContractCompleted !== true && (
                <Box
                  sx={{
                    position: 'absolute',
                    zIndex: 1,
                    height: '100%',
                    width: '100%'
                  }}
                />
              )}
              {/* <Typography>
                <b>2. Finish.</b> Please go to your account to view the profit and details of this transaction
              </Typography> */}
              <Box mt={32}>
                <OutlineButton primary onClick={() => history.replace(routes.account)} borderRadius="16px">
                  Go to My Account
                </OutlineButton>
              </Box>
            </Box>
          </>
        )}
      </Card>
      {step === Step.Confirm && <WarningCard subject={Subject.TakeOffer} />}
    </Box>
  )
}
