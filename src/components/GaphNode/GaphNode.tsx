import React, { useEffect } from 'react'
import { SimulationGaphNode } from '../../types/d3-force'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { activateNode, selectNodeStack } from '../Game/gameSlice'
import { useSpringRef, useSpring, animated, SpringConfig } from 'react-spring'
import { ReactComponent as HomeIconWhite } from '../../images/home-white.svg'

interface GaphNodeProps {
  node: SimulationGaphNode
  radius: number
}

export default function GaphNode(props: GaphNodeProps) {
  const dispatch = useAppDispatch()
  const nodeStack = useAppSelector(selectNodeStack)

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
      <animated.circle cx={props.node.x} cy={props.node.y} r={circleProps.r} fill={circleProps.fill}></animated.circle>
      {nodeStack[0] === props.node.id && (
        <HomeIconWhite
          x={(props.node.x ?? 0) - props.radius * 0.5}
          y={(props.node.y ?? 0) - props.radius * 0.5}
          width={props.radius}
          height={props.radius}
        />
      )}
    </g>
  )
}
