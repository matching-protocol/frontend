import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { getGlobalTokenList } from 'utils/fetch/order'
import { SourceTokenListProp, updateSourceTokenListData } from '../state/token/actions'

export default function InitProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch()
  const [reLoad, setReLoad] = useState(0)
  const [next, setNext] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const res: any = await getGlobalTokenList()
        const _token = res.data.tokens.map((item: any) => {
          item.supportChainIds = item.chains.map((i: { chainId: number }) => i.chainId)
          return item
        })

        dispatch(updateSourceTokenListData({ sourceTokenList: _token as SourceTokenListProp[] }))
        const el = document.querySelector('.loader-container')
        if (el) {
          el.remove()
        }
        setTimeout(() => setNext(true), 100)
      } catch (error) {
        console.warn('Updater token ~ error', error)
        setTimeout(() => setReLoad(reLoad + 1), 3000)
      }
    })()
  }, [dispatch, reLoad])

  return <>{next ? children : null}</>
}
