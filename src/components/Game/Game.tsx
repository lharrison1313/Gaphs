import React, { ReactNode, useEffect, useState } from 'react'
import './Game.css'
import * as d3_force from 'd3-force'
import { SimulationGaphNode, SimulationGaphLink } from '../../types/d3-force'
import GaphNode from '../GaphNode/GaphNode'
import GaphLink from '../GaphLink/GaphLink'
import { useAppSelector } from '../../hooks'
import { selectCount } from './gameSlice'

export default function Game() {
  const [nodeData, setNodeData] = useState<SimulationGaphNode[]>([])
  const count = useAppSelector(selectCount)

  const width = 800
  const height = 500
  const nodeRadius = 25
  const nodes: SimulationGaphNode[] = [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }, { id: 'e' }]
  const links: SimulationGaphLink[] = [
    { source: 'a', target: 'b', weight: 20 },
    { source: 'a', target: 'c', weight: 10 },
    { source: 'a', target: 'd', weight: 5 },
    { source: 'd', target: 'e', weight: 2 },
    { source: 'b', target: 'c', weight: 8 },
  ]

  useEffect(() => {
    let simulation = d3_force
      .forceSimulation(nodes)
      .force(
        'link',
        d3_force
          .forceLink(links)
          .id((d) => (d as SimulationGaphNode).id)
          .distance(125)
      )
      .force('center', d3_force.forceCenter(width / 2, height / 2))
      .force('charge', d3_force.forceManyBody().strength(-200))
      .force('collision', d3_force.forceCollide().radius(nodeRadius))
      .tick(1000)
    setNodeData(simulation.nodes())
  }, [])

  const renderNodes = (nodes: SimulationGaphNode[], radius: number): ReactNode[] => {
    let nodeElements: ReactNode[] = []
    nodes.forEach((node) => {
      nodeElements.push(<GaphNode radius={radius} node={node} key={node.id} />)
    })
    return nodeElements
  }

  const renderLinks = (nodes: SimulationGaphNode[], links: SimulationGaphLink[]) => {
    let linkElements: ReactNode[] = []
    links.forEach((link) => {
      let source: SimulationGaphNode | undefined = nodes.find((node) => node.id === link.source)
      let target: SimulationGaphNode | undefined = nodes.find((node) => node.id === link.target)
      if (source && target) {
        linkElements.push(<GaphLink source={source} target={target} link={link} key={source.id + target.id} />)
      }
    })
    return linkElements
  }

  return (
    <div className="game">
      <div className="gaph-container" style={{ width: width, height: height }}>
        <svg viewBox={`0 0 ${width} ${height}`}>
          <text x={10} y={20} fill="white">
            Count: {count}
          </text>
          {renderLinks(nodeData, links)}
          {renderNodes(nodeData, nodeRadius)}
        </svg>
      </div>
    </div>
  )
}
