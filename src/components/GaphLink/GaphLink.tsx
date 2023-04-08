import { SimulationGaphLink } from '../../types/d3-force'
import { SimulationGaphNode } from '../../types/d3-force'

interface GaphLinkProps {
  link: SimulationGaphLink
  source: SimulationGaphNode
  target: SimulationGaphNode
}

export default function GaphLink(props: GaphLinkProps) {
  return <path d={`M ${props.source.x} ${props.source.y} L ${props.target.x} ${props.target.y}`} stroke="black" />
}
