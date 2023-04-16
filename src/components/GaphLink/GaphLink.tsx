import { useEffect } from 'react'
import { SimulationGaphLinkAndNodes } from '../../types/d3-force'
import { useSpringRef, useSpring, animated, SpringConfig } from 'react-spring'
import { useDispatch } from 'react-redux'
import { reorderLinks } from '../Game/gameSlice'

interface GaphLinkProps {
  link: SimulationGaphLinkAndNodes
}

export default function GaphLink(props: GaphLinkProps) {
  const getlinkColor = (clickedCount: number) => {
    switch (clickedCount) {
      case -1:
      case 0:
        return '#3D4B6B'
      case 1:
        return '#276FAB'
      case 2:
        return '#db8830'
      default:
        return '#db3030'
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

  const dispatch = useDispatch()

  useEffect(() => {
    animation.start({ to: { color: getlinkColor(props.link.crossedCount) } })
  }, [props.link.crossedCount])

  const handleMouseEnter = () => {
    dispatch(reorderLinks(props.link))
  }

  return (
    <g onMouseEnter={handleMouseEnter}>
      <animated.line
        x1={props.link.source.x}
        y1={props.link.source.y}
        x2={props.link.target.x}
        y2={props.link.target.y}
        stroke={linkProps.color}
        strokeWidth={5}
      />
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
