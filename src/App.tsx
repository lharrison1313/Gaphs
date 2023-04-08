import React, { ReactNode, useEffect, useState } from 'react'
import './App.css'
import * as d3_force from 'd3-force'
import { SimulationGaphNode, SimulationGaphLink } from './types/d3-force'
import GaphNode from './components/GaphNode/GaphNode'
import GaphLink from './components/GaphLink/GaphLink'

export default function App() {
  const [nodeData, setNodeData] = useState<SimulationGaphNode[]>([])
  const width = 800
  const height = 500
  const nodes: SimulationGaphNode[] = [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }]
  const links: SimulationGaphLink[] = [
    { source: 'a', target: 'b', weight: 20 },
    { source: 'a', target: 'c', weight: 10 },
    { source: 'a', target: 'd', weight: 5 },
  ]

  useEffect(() => {
    let simulation = d3_force
      .forceSimulation(nodes)
      .force(
        'link',
        d3_force
          .forceLink(links)
          .id((d) => (d as SimulationGaphNode).id)
          .distance(100)
      )
      .force('center', d3_force.forceCenter(width / 2, height / 2))
      .force('charge', d3_force.forceManyBody().strength(-200))
      .force('collision', d3_force.forceCollide().radius(10))
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
    <div className="app">
      <div className="gaph-container" style={{ width: width, height: height }}>
        <svg viewBox={`0 0 ${width} ${height}`}>
          {renderLinks(nodeData, links)}
          {renderNodes(nodeData, 25)}
        </svg>
      </div>
    </div>
  )
}
