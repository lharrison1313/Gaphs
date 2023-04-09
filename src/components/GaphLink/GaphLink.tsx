import { SimulationGaphLinkAndNodes } from '../../types/d3-force'

interface GaphLinkProps {
  link: SimulationGaphLinkAndNodes
}

export default function GaphLink(props: GaphLinkProps) {
  return (
    <g>
      <path d={`M ${props.link.source.x} ${props.link.source.y} L ${props.link.target.x} ${props.link.target.y}`} stroke="black" />
      <text
        x={((props.link.source.x ?? 0) + (props.link.target.x ?? 0)) / 2}
        y={((props.link.source.y ?? 0) + (props.link.target.y ?? 0)) / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="white"
      >
        {props.link.weight}
      </text>
    </g>
  )
}
