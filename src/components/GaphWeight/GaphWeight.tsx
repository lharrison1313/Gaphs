import { SimulationGaphLinkAndNodes } from '../../types/d3-force'

interface GaphWeightProps {
  link: SimulationGaphLinkAndNodes
}

export default function GaphWeight(props: GaphWeightProps) {
  return (
    <text
      x={((props.link.source.x ?? 0) + (props.link.target.x ?? 0)) / 2}
      y={((props.link.source.y ?? 0) + (props.link.target.y ?? 0)) / 2}
      textAnchor="middle"
      dominantBaseline="middle"
      fill="white"
    >
      {props.link.weight}
    </text>
  )
}
