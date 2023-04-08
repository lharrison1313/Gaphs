import { SimulationGaphNode } from '../../types/d3-force'

interface GaphNodeProps {
  node: SimulationGaphNode
  radius: number
}

export default function GaphNode(props: GaphNodeProps) {
  return (
    <g>
      <circle cx={props.node.x} cy={props.node.y} r={props.radius} />
      <text x={props.node.x} y={props.node.y} textAnchor="middle" dominantBaseline="middle" fill="white">
        {props.node.id}
      </text>
    </g>
  )
}
