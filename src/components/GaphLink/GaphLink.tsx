import { useEffect } from 'react'
import { SimulationGaphLinkAndNodes } from '../../types/d3-force'
import { useSpringRef, useSpring, animated, SpringConfig } from 'react-spring'

interface GaphLinkProps {
  link: SimulationGaphLinkAndNodes
}

export default function GaphLink(props: GaphLinkProps) {
  const getlinkColor = (clickedCount: number) => {
    switch (clickedCount) {
      case -1:
      case 0:
        return 'grey'
      case 1:
        return 'black'
      case 2:
        return 'blue'
      default:
        return 'red'
    }
  }

  const animation = useSpringRef()
  const config: SpringConfig = { duration: 150 }
  const linkProps = useSpring({
    ref: animation,
    from: { color: getlinkColor(props.link.crossedCount - 1) },
    to: { color: getlinkColor(props.link.crossedCount) },
    config: config,
  })

  useEffect(() => {
    animation.start()
  }, [props.link.crossedCount])

  return (
    <g>
      <animated.line x1={props.link.source.x} y1={props.link.source.y} x2={props.link.target.x} y2={props.link.target.y} stroke={linkProps.color} />
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
