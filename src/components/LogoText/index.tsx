import { styled, Typography } from '@mui/material'
import Image from '../Image'

const Wrapper = styled('div')({})

export default function LogoText({
  logo,
  text,
  fontWeight,
  fontSize,
  gapSize,
  size,
  widthEllipsis
}: {
  logo: string | JSX.Element
  text?: string | React.ReactNode
  fontWeight?: number
  fontSize?: number | string
  gapSize?: number | string
  size?: string
  widthEllipsis?: string
}) {
  return (
    <Wrapper
      sx={{
        display: 'flex',
        alignItems: 'center',
        fontWeight: fontWeight ?? 400,
        fontSize: fontSize ?? 16,
        '& > img, > svg': {
          marginRight: gapSize || '10px',
          height: size ? size : '20px',
          width: size ? size : '20px'
        }
      }}
    >
      {typeof logo === 'string' ? <Image src={logo as string} /> : logo}
      {widthEllipsis ? (
        <Typography textOverflow={'ellipsis'} sx={{ width: widthEllipsis || 'unset', overflowX: 'hidden' }}>
          {text}
        </Typography>
      ) : (
        <span>{text}</span>
      )}
    </Wrapper>
  )
}
