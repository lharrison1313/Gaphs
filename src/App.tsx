import React, { ReactNode, useEffect, useState } from 'react'
import './App.css'
import * as d3_force from 'd3-force'

interface GaphNode extends d3_force.SimulationNodeDatum {
  id: string
}

function Node(props: any) {
  return (
    <g>
      <circle cx={props.cx} cy={props.cy} r={props.r} />
      <text
        x={props.cx}
        y={props.cy}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="white"
      >
        {props.text}
      </text>
    </g>
  )
}

export default function App() {
  const [nodeData, setNodeData] = useState<GaphNode[]>([])
  const width = 800
  const height = 500

  let nodes: GaphNode[] = [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }]
  let links: d3_force.SimulationLinkDatum<GaphNode>[] = [
    { source: 'a', target: 'b' },
    { source: 'a', target: 'c' },
    { source: 'a', target: 'd' },
  ]

  useEffect(() => {
    let simulation = d3_force
      .forceSimulation(nodes)
      .force(
        'link',
        d3_force
          .forceLink(links)
          .id((d) => (d as GaphNode).id)
          .distance(100)
      )
      .force('center', d3_force.forceCenter(width / 2, height / 2))
      .force('charge', d3_force.forceManyBody().strength(-200))
      .force('collision', d3_force.forceCollide().radius(10))
      .tick(1000)
    setNodeData(simulation.nodes())
  }, [])

  const renderNodes = (nodes: GaphNode[], radius: number): ReactNode[] => {
    let nodeElements: ReactNode[] = []
    nodes.forEach((node) => {
      nodeElements.push(
        <Node cx={node.x} cy={node.y} r={radius} text={node.id} key={node.id} />
      )
    })
    return nodeElements
  }

  return (
    <div className="app">
      <div className="gaph-container" style={{ width: width, height: height }}>
        <svg viewBox={`0 0 ${width} ${height}`}>
          {renderNodes(nodeData, 25)}
        </svg>
      </div>
    </div>
  )
}
