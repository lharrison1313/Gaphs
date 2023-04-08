import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../store'
import { SimulationGaphLink, SimulationGaphNode } from '../../types/d3-force'
import { cloneDeep } from 'lodash'

interface GameState {
  nodes: SimulationGaphNode[]
  links: SimulationGaphLink[]
  score: number
}

const initialState: GameState = {
  nodes: [],
  links: [],
  score: 0,
}

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setScore: (state, action: PayloadAction<number>) => {
      state.score = action.payload
    },
    setNodes: (state, action: PayloadAction<SimulationGaphNode[]>) => {
      state.nodes = cloneDeep(action.payload)
    },
    setLinks: (state, action: PayloadAction<SimulationGaphLink[]>) => {
      state.links = cloneDeep(action.payload)
    },
  },
})

export const { setScore, setNodes, setLinks } = gameSlice.actions

export const selectScore = (state: RootState) => state.game.score
export const selectNodes = (state: RootState) => state.game.nodes
export const selectLinks = (state: RootState) => state.game.links

export default gameSlice.reducer
