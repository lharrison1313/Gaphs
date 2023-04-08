import { SimulationNodeDatum, SimulationLinkDatum } from 'd3-force'

export interface SimulationGaphNode extends SimulationNodeDatum {
  id: string
  clickedCount: number
}

export interface SimulationGaphLink extends SimulationLinkDatum<SimulationGaphNode> {
  weight: number
}
