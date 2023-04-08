import React, { ReactNode, useEffect } from 'react'
import './Game.css'
import * as d3_force from 'd3-force'
import { SimulationGaphNode, SimulationGaphLink } from '../../types/d3-force'
import GaphNode from '../GaphNode/GaphNode'
import GaphLink from '../GaphLink/GaphLink'
import { useAppSelector, useAppDispatch } from '../../hooks'
import { selectLinks, selectNodes, selectScore, setLinks, setNodes } from './gameSlice'

export default function Game() {
  const dispatch = useAppDispatch()
  const count = useAppSelector(selectScore)
  const nodes: SimulationGaphNode[] = useAppSelector(selectNodes)
  const links: SimulationGaphLink[] = useAppSelector(selectLinks)

  const width = 800
  const height = 500
  const nodeRadius = 25
  const nodeData: SimulationGaphNode[] = [
    { id: 'a', clickedCount: 0 },
    { id: 'b', clickedCount: 0 },
    { id: 'c', clickedCount: 0 },
    { id: 'd', clickedCount: 0 },
    { id: 'e', clickedCount: 0 },
  ]
  const linkData: SimulationGaphLink[] = [
    { source: 'a', target: 'b', weight: 20 },
    { source: 'a', target: 'c', weight: 10 },
    { source: 'a', target: 'd', weight: 5 },
    { source: 'd', target: 'e', weight: 2 },
    { source: 'b', target: 'c', weight: 8 },
  ]

  useEffect(() => {
    let simulation = d3_force
      .forceSimulation(nodeData)
      .force(
        'link',
        d3_force
          .forceLink(linkData)
          .id((d) => (d as SimulationGaphNode).id)
          .distance(125)
      )
      .force('center', d3_force.forceCenter(width / 2, height / 2))
      .force('charge', d3_force.forceManyBody().strength(-200))
      .force('collision', d3_force.forceCollide().radius(nodeRadius))
      .tick(1000)
    dispatch(setNodes(simulation.nodes()))
    dispatch(setLinks(linkData))
  }, [])

  useEffect(() => {
    console.log(links)
  }, [links])

  const renderNodes = (nodes: SimulationGaphNode[], radius: number): ReactNode[] => {
    let nodeElements: ReactNode[] = []
    nodes.forEach((node) => {
      nodeElements.push(<GaphNode radius={radius} node={node} key={node.id} />)
    })
    return nodeElements
  }

  const renderLinks = (links: SimulationGaphLink[]) => {
    let linkElements: ReactNode[] = []
    links.forEach((link) => {
      let newSource: SimulationGaphNode = link.source as SimulationGaphNode
      let newTarget: SimulationGaphNode = link.target as SimulationGaphNode
      linkElements.push(<GaphLink source={newSource} target={newTarget} weight={link.weight} key={newSource.id + newTarget.id} />)
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
          {renderLinks(links)}
          {renderNodes(nodes, nodeRadius)}
        </svg>
      </div>
    </div>
  )
}
