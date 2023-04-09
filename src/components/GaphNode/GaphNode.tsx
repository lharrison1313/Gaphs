import React, { useEffect } from 'react'
import { SimulationGaphNode } from '../../types/d3-force'
import { useAppDispatch } from '../../hooks'
import { activateNode } from '../Game/gameSlice'
import { useSpringRef, useSpring, animated, SpringConfig } from 'react-spring'

interface GaphNodeProps {
  node: SimulationGaphNode
  radius: number
}

export default function GaphNode(props: GaphNodeProps) {
  const dispatch = useAppDispatch()

  const getNodeColor = (clickedCount: number) => {
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
  const circleProps = useSpring({
    ref: animation,
    from: { r: props.radius, fill: getNodeColor(props.node.clickedCount - 1) },
    to: [
      { r: props.radius * 0.75, fill: getNodeColor(props.node.clickedCount) },
      { r: props.radius, fill: getNodeColor(props.node.clickedCount) },
    ],
    config: config,
  })

  const handleNodeClick = () => {
    dispatch(activateNode(props.node))
  }

  useEffect(() => {
    console.log(`${props.node.id}: ${props.node.clickedCount}`)
    animation.start()
  }, [props.node.clickedCount])

  return (
    <g onClick={handleNodeClick}>
      <animated.circle cx={props.node.x} cy={props.node.y} r={circleProps.r} fill={circleProps.fill} />
      <text x={props.node.x} y={props.node.y} textAnchor="middle" dominantBaseline="middle" fill="white"></text>
    </g>
  )
}
