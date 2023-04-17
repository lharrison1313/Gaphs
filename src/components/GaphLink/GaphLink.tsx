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

  useEffect(() => {
    animation.start({ to: { color: getlinkColor(props.link.crossedCount) } })
  }, [props.link.crossedCount])

  return (
    <animated.line
      x1={props.link.source.x}
      y1={props.link.source.y}
      x2={props.link.target.x}
      y2={props.link.target.y}
      stroke={linkProps.color}
      strokeWidth={5}
    />
  )
}
