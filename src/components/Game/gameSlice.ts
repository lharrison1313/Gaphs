import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../store'
import { SimulationGaphLinkAndNodes, SimulationGaphNode } from '../../types/d3-force'
import { cloneDeep } from 'lodash'

interface GameState {
  nodes: SimulationGaphNode[]
  activeNode: SimulationGaphNode
  links: SimulationGaphLinkAndNodes[]
  nodeStack: string[]
  score: number
  path: number
}

const initialState: GameState = {
  nodes: [],
  activeNode: { id: '', clickedCount: 0 },
  links: [],
  nodeStack: [],
  score: 0,
  path: 0,
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
    updateLink: (state, action: PayloadAction<SimulationGaphLinkAndNodes>) => {
      let newLinks = cloneDeep(state.links)
      let replaceIndex = newLinks.findIndex((link) => link.source.id === action.payload.source.id && link.target.id === action.payload.target.id)
      newLinks[replaceIndex] = action.payload
      state.links = newLinks
    },
    incrementScore: (state, action: PayloadAction<number>) => {
      state.score += action.payload
    },
    incrementPath: (state, action: PayloadAction<number>) => {
      state.path += action.payload
    },
    pushNode: (state, action: PayloadAction<string>) => {
      state.nodeStack.push(action.payload)
    },
    activateNode: (state, action: PayloadAction<SimulationGaphNode>) => {
      state.activeNode = cloneDeep(action.payload)
    },
    resetGame: () => {
      return {
        nodes: [],
        activeNode: { id: '', clickedCount: 0 },
        links: [],
        nodeStack: [],
        score: 0,
        path: 0,
      }
    },
  },
})

export const { incrementScore, setNodes, setLinks, pushNode, updateNode, updateLink, activateNode, resetGame, incrementPath } = gameSlice.actions

export const selectScore = (state: RootState) => state.game.score
export const selectPath = (state: RootState) => state.game.path
export const selectNodes = (state: RootState) => state.game.nodes
export const selectLinks = (state: RootState) => state.game.links
export const selectActiveNode = (state: RootState) => state.game.activeNode
export const selectNodeStack = (state: RootState) => state.game.nodeStack

export default gameSlice.reducer
