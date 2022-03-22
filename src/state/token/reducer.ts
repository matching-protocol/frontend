import { createReducer } from '@reduxjs/toolkit'
import { SourceTokenListProp, updateSourceTokenListData } from './actions'

interface TokenState {
  sourceTokenList: SourceTokenListProp[]
}

export const initialState: TokenState = {
  sourceTokenList: []
}

export default createReducer(initialState, builder =>
  builder.addCase(updateSourceTokenListData, (state, action) => {
    state.sourceTokenList = action.payload.sourceTokenList
  })
)
