import { ComponentStory, ComponentMeta } from '@storybook/react'
import SwapSelect from 'components/Swap/SwapSelect'
import { Chain } from 'models/chain'
import DummyLogo from 'assets/images/ethereum-logo.png'
import { useState } from 'react'
import { Currency } from 'constants/token/currency'

export default {
  title: 'Input/SwapSelect',
  component: SwapSelect
} as ComponentMeta<typeof SwapSelect>

const ChainList = [
  {
    logo: DummyLogo,
    symbol: 'ETH',
    id: 1,
    address: 'XXXXXXXXXXXXXXXXXXXX',
    name: 'Ethereum Mainnet'
  },
  {
    logo: DummyLogo,
    symbol: 'BSC',
    id: 1,
    address: 'XXXXXXXXXXXXXXXXXXXX',
    name: 'Binance Smart Chain'
  }
]

const DefaultTemplate: ComponentStory<typeof SwapSelect> = () => {
  const [selected, setSelected] = useState<Chain | Currency | null>(null)

  return <SwapSelect list={ChainList} selected={selected} onChange={chain => setSelected(chain)} />
}
export const Default = DefaultTemplate.bind({})
