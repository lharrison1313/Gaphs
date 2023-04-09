import React from 'react'
import { SimulationGaphNode } from '../../types/d3-force'
import { useAppDispatch } from '../../hooks'
import { pushNode } from '../Game/gameSlice'

interface GaphNodeProps {
  node: SimulationGaphNode
  radius: number
}

export default function GaphNode(props: GaphNodeProps) {
  const dispatch = useAppDispatch()

  const handleNodeClick = () => {
    dispatch(pushNode(props.node.id))
  }

  const getNodeColor = () => {
    switch (props.node.clickedCount) {
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

  return (
    <g onClick={handleNodeClick}>
      <circle cx={props.node.x} cy={props.node.y} r={props.radius} fill={getNodeColor()} />
      <text x={props.node.x} y={props.node.y} textAnchor="middle" dominantBaseline="middle" fill="white">
        {props.node.id}
      </text>
    </g>
  )
}
