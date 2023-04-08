import { SimulationGaphLink, SimulationGaphNode } from '../../types/d3-force'

interface GaphLinkProps {
  link: SimulationGaphLink
  source: SimulationGaphNode
  target: SimulationGaphNode
}

export default function GaphLink(props: GaphLinkProps) {
  return (
    <g>
      <path d={`M ${props.source.x} ${props.source.y} L ${props.target.x} ${props.target.y}`} stroke="black" />
      <text
        x={((props.source.x ?? 0) + (props.target.x ?? 0)) / 2}
        y={((props.source.y ?? 0) + (props.target.y ?? 0)) / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="white"
      >
        {props.link.weight}
      </text>
    </g>
  )
}
