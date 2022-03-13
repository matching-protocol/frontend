import { styled } from '@mui/material'
import { Dots } from 'theme/components'

const Frame = styled('div')(`
margin-top: 10vh;
width: 500px;
height: 280px;
border: 1px solid rgba(0, 0, 0, 0.2);
box-sizing: border-box;
border-radius: 32px;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
color: rgba(0, 0, 0, 0.6);
`)

const Title = styled('p')(`
  font-weight: 500;
  font-size: 24px;
  line-height: 88.69%;
  color: #000;
`)

export default function ComingSoon() {
  return (
    <Frame>
      <Title>
        Coming Soon <Dots />
      </Title>
      <div>This section is still implemeting.</div>
      <div>Please come back later</div>
    </Frame>
  )
}
