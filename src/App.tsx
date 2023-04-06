import React, { ReactNode } from 'react'
import './App.css'

//paths
//l diagonal x and y
//L diagonal to a position x and y
//h horizantal x
//H horizantal to a position x
//v horizantal y
//V horizantal to a position y
function App() {
  type edge = {
    from: string
    to: string
    weight: number
  }

  type point = {
    x: number
    y: number
  }

  const nodes: string[] = ['a', 'b', 'c', 'd']
  const edges: edge[] = [
    { from: 'a', to: 'b', weight: 10 },
    { from: 'b', to: 'c', weight: 5 },
    { from: 'c', to: 'd', weight: 10 },
  ]

  const drawGraph = (nodes: string[], edges: edge[]): ReactNode => {
    let nodeSize = 25 //size of nodes
    let nodeDistance = 100 //the distance between any 2 nodes
    let nodeElements: ReactNode[] = []
    let edgeElements: ReactNode[] = []
    let nodePositionMap: { [key: string]: point } = generateNodePositionMap(
      nodes,
      edges,
      nodeDistance
    )

    for (let node in nodePositionMap) {
      nodeElements.push(
        <g>
          <circle
            cx={nodePositionMap[node].x.toString()}
            cy={nodePositionMap[node].y.toString()}
            r={nodeSize.toString()}
          />
          <text
            x={nodePositionMap[node].x.toString()}
            y={nodePositionMap[node].y.toString()}
            text-anchor="middle"
            dominant-baseline="middle"
            fill="white"
          >
            {node}
          </text>
        </g>
      )
    }

    for (let edge of edges) {
      let fromNodePos = nodePositionMap[edge.from]
      let toNodePos = nodePositionMap[edge.to]
      edgeElements.push(
        <path
          d={`M ${fromNodePos.x} ${fromNodePos.y} L ${toNodePos.x} ${toNodePos.y}`}
          stroke="black"
        />
      )
    }

    let size = nodes.length * nodeDistance
    return (
      <div style={{ width: size, height: size }}>
        <svg viewBox={`0 0 ${size} ${size}`}>
          {nodeElements}
          {edgeElements}
        </svg>
      </div>
    )
  }

  const generateNodePositionMap = (
    nodes: string[],
    edges: edge[],
    nodeDistance: number
  ): { [key: string]: point } => {
    let center: point = {
      x: Math.floor(nodes.length / 2) * nodeDistance,
      y: Math.floor(nodes.length / 2) * nodeDistance,
    } //the center of the graph
    let nodePositionMap: { [key: string]: point } = {}

    nodes.forEach((node, index) => {
      if (index === 0) {
        nodePositionMap[node] = center //put first node at center
      } else {
        //find related node by checking both to and from on all edges
        let relatedNode =
          edges.find((edge) => edge.to === node)?.from ||
          edges.find((edge) => edge.from === node)?.to

        // if none found node is orphan
        if (!relatedNode)
          throw new Error('error: graph cannot have an ophaned node')
        let relatedNodePosition: point = nodePositionMap[relatedNode] //get related nodes position

        //generate two numbers between -1 and 0 this will determine where to place the next node
        //TODO: handle collisions
        let num1, num2
        do {
          num1 = Math.floor(Math.random() * 3) - 1
          num2 = Math.floor(Math.random() * 3) - 1
        } while (num1 === 0 && num2 === 0)

        //set new nodes position
        let newNodePosition: point = structuredClone(relatedNodePosition)
        newNodePosition.x = num1 * nodeDistance + newNodePosition.x
        newNodePosition.y = num2 * nodeDistance + newNodePosition.y
        nodePositionMap[node] = newNodePosition
      }
    })

    return nodePositionMap
  }

  return <div>{drawGraph(nodes, edges)}</div>
}

export default App
