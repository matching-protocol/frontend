import { useMemo } from 'react'
import Card from 'components/Card'
import { Typography, Box, styled } from '@mui/material'

export enum Subject {
  MakeOffer = 'Make Offer',
  TakeOffer = 'Take Offer'
}

const StyledOrderList = styled('ol')(({ theme }) => ({
  display: 'grid',
  listStyle: 'none',
  counterReset: 'counterReset',
  position: 'relative',
  gap: 24,
  paddingInlineStart: 32,
  '& li': {
    fontSize: 14,
    fontWeight: 400
  },
  '& li:before': {
    counterIncrement: 'counterReset',
    content: 'counter(counterReset)',
    color: theme.palette.primary.main,
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    border: '1px solid #161616',
    float: 'left',
    textAlign: 'center',
    position: 'absolute',
    left: 0,
    fontSize: 13
  }
}))

export default function WarningCard({ subject }: { subject: Subject }) {
  const warningListItems = useMemo(() => {
    const listItems = {
      [Subject.MakeOffer]: [
        'You need to determine the amount you want to incentivize the market maker to complete the quotation. Our recommended amount usually guarantees that the market maker has a surplus after paying the gas fee.',
        'The suggested amount is calculated based on the exchange ratio given by the current market price. It is only for reference. You can also set it yourself. Unreasonable amounts may not be traded.',
        'The offer can be cancelled before taking the offer.'
      ],
      [Subject.TakeOffer]: [
        'Please make sure you have enough fund in your wallet on the right chain to send to requester',
        'Once you take offer, you will have 2 minutes to execute fund',
        'If you fail to execute fund within 2 minutes, your offer will expire and you will need to retake the offer'
      ]
    }

    return listItems[subject]
  }, [subject])

  return (
    <Card width="100%" padding="24px 60px 37px">
      <Typography fontSize={16} fontWeight={700}>
        Warning Info
      </Typography>
      <Box fontSize={{ xs: 14, md: 16 }}>
        <StyledOrderList>
          {warningListItems.map((li, idx) => (
            <li key={idx}>{li}</li>
          ))}
        </StyledOrderList>
      </Box>
    </Card>
  )
}
