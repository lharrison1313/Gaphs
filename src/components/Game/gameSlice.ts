import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../store'
import { SimulationGaphLinkAndNodes, SimulationGaphNode } from '../../types/d3-force'
import { cloneDeep } from 'lodash'

interface GameState {
  nodes: SimulationGaphNode[]
  links: SimulationGaphLinkAndNodes[]
  nodeStack: string[]
  score: number
}

const initialState: GameState = {
  nodes: [],
  links: [],
  nodeStack: [],
  score: 0,
}

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setNodes: (state, action: PayloadAction<SimulationGaphNode[]>) => {
      state.nodes = cloneDeep(action.payload)
    },
    updateNode: (state, action: PayloadAction<SimulationGaphNode>) => {
      let newNodes = cloneDeep(state.nodes)
      let replaceIndex = newNodes.findIndex((node) => node.id === action.payload.id)
      newNodes[replaceIndex] = action.payload
      state.nodes = newNodes
    },
    setLinks: (state, action: PayloadAction<SimulationGaphLinkAndNodes[]>) => {
      state.links = cloneDeep(action.payload)
    },
    incrementScore: (state, action: PayloadAction<number>) => {
      state.score += action.payload
    },
    pushNode: (state, action: PayloadAction<string>) => {
      state.nodeStack.push(action.payload)
    },
  },
})

export const { incrementScore, setNodes, setLinks, pushNode, updateNode } = gameSlice.actions

export const selectScore = (state: RootState) => state.game.score
export const selectNodes = (state: RootState) => state.game.nodes
export const selectLinks = (state: RootState) => state.game.links
export const selectNodeStack = (state: RootState) => state.game.nodeStack

export const selectSpecificNodes = createSelector([selectNodes, (state: RootState, id: string) => id], (nodes, id) =>
  nodes.find((node) => node.id === id)
)

export default gameSlice.reducer
