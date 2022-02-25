import { ComponentStory, ComponentMeta } from '@storybook/react'
import ChainSelect from 'components/Select/ChainSelect'
import { Chain } from 'models/chain'
import DummyLogo from 'assets/images/ethereum-logo.png'
import { useState } from 'react'
import { Currency } from 'constants/token/currency'

export default {
  title: 'Input/ChainSelect',
  component: ChainSelect
} as ComponentMeta<typeof ChainSelect>

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

const DefaultTemplate: ComponentStory<typeof ChainSelect> = () => {
  const [selected, setSelected] = useState<Chain | Currency | null>(null)

  return <ChainSelect list={ChainList} selected={selected} onChange={chain => setSelected(chain)} />
}
export const Default = DefaultTemplate.bind({})
