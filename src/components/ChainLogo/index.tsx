import LogoText from 'components/LogoText'
import Image from 'components/Image'
import { ChainListMap } from 'constants/chain'

export default function index({ size, chainId }: { size: string; chainId: number }) {
  return (
    <LogoText
      logo={<Image height="20px" src={ChainListMap[chainId].logo} alt="" />}
      text={ChainListMap[chainId].symbol}
      size={size}
    />
  )
}
