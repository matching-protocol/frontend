import LogoText from 'components/LogoText'
import Image from 'components/Image'
import { ChainListMap } from 'constants/chain'

export default function index({
  size,
  chainId,
  fontSize,
  gapSize,
  widthEllipsis
}: {
  size: string
  chainId: number
  fontSize?: string
  gapSize?: string
  widthEllipsis?: string
}) {
  return (
    <LogoText
      logo={<Image height="20px" src={ChainListMap[chainId].logo} alt="" />}
      text={ChainListMap[chainId].symbol}
      widthEllipsis={widthEllipsis}
      size={size}
      gapSize={gapSize}
      fontSize={fontSize}
    />
  )
}
