import React from 'react'
import { SimulationGaphNode } from '../../types/d3-force'
import { useAppDispatch } from '../../hooks'
import { incrementByAmount } from '../Game/gameSlice'

interface GaphNodeProps {
  node: SimulationGaphNode
  radius: number
}

export default function GaphNode(props: GaphNodeProps) {
  const dispatch = useAppDispatch()
  const handleNodeClick = () => {
    dispatch(incrementByAmount(10))
  }

  return (
    <g onClick={handleNodeClick}>
      <circle cx={props.node.x} cy={props.node.y} r={props.radius} />
      <text x={props.node.x} y={props.node.y} textAnchor="middle" dominantBaseline="middle" fill="white">
        {props.node.id}
      </text>
    </g>
  )
}
