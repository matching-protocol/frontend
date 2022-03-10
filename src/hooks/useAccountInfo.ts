import { useEffect, useState } from 'react'
import { useActiveWeb3React } from './index'
import { fetchAccountTotalValue } from '../utils/fetch/debank'

export function useAccountTotalValue() {
  const { account, chainId } = useActiveWeb3React()
  const [result, setResult] = useState<number | undefined>(undefined)

  useEffect(() => {
    if (!account || !chainId) return
    ;(async () => {
      try {
        const res: any = await fetchAccountTotalValue(account, chainId)
        setResult(res.data.usd_value)
      } catch (_) {
        setResult(undefined)
      }
    })()
  }, [account, chainId])

  return result
}
