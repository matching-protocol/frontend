import Card from 'components/Card'
import { Box } from '@mui/material'
// import { Typography } from '@mui/material'
import LogoText from 'components/LogoText'
import OfferIcon from 'assets/images/offer.png'

export default function Offer() {
  return (
    <Box pt={68}>
      <Card width="828px" padding="24px 60px 44px">
        <LogoText logo={OfferIcon} text=" Make an Offer" size="32px" fontSize={36} fontWeight={700} />
      </Card>
    </Box>
  )
}
