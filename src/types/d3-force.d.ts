import { SimulationNodeDatum, SimulationLinkDatum } from 'd3-force'

export interface SimulationGaphNode extends SimulationNodeDatum {
  id: string
}

export interface SimulationGaphLink extends SimulationLinkDatum<SimulationGaphLink> {
  weight: number
}
