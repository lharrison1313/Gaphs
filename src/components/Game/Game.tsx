import React, { ReactNode, useEffect } from 'react'
import './Game.css'
import * as d3_force from 'd3-force'
import { SimulationGaphNode, SimulationGaphLink, SimulationGaphLinkAndNodes } from '../../types/d3-force'
import GaphNode from '../GaphNode/GaphNode'
import GaphLink from '../GaphLink/GaphLink'
import { useAppSelector, useAppDispatch } from '../../hooks'
import {
  incrementScore,
  pushNode,
  selectActiveNode,
  selectLinks,
  selectNodeStack,
  selectNodes,
  selectScore,
  setLinks,
  setNodes,
  updateLink,
  updateNode,
} from './gameSlice'
import { cloneDeep } from 'lodash'

export default function Game() {
  const dispatch = useAppDispatch()
  const score = useAppSelector(selectScore)
  const nodes: SimulationGaphNode[] = useAppSelector(selectNodes)
  const links: SimulationGaphLinkAndNodes[] = useAppSelector(selectLinks)
  const nodeStack: string[] = useAppSelector(selectNodeStack)
  const activeNode: SimulationGaphNode = useAppSelector(selectActiveNode)

  const width = 500
  const height = 450
  const nodeRadius = 25
  const nodeDistance = 125
  const nodeData: SimulationGaphNode[] = [
    { id: 'a', clickedCount: 0 },
    { id: 'b', clickedCount: 0 },
    { id: 'c', clickedCount: 0 },
    { id: 'd', clickedCount: 0 },
    { id: 'e', clickedCount: 0 },
  ]
  const linkData: SimulationGaphLink[] = [
    { source: 'a', target: 'b', weight: 20, crossedCount: 0 },
    { source: 'a', target: 'c', weight: 10, crossedCount: 0 },
    { source: 'a', target: 'd', weight: 5, crossedCount: 0 },
    { source: 'd', target: 'e', weight: 2, crossedCount: 0 },
    { source: 'b', target: 'c', weight: 8, crossedCount: 0 },
    { source: 'e', target: 'b', weight: 4, crossedCount: 0 },
  ]

  useEffect(() => {
    let forceLink = d3_force
      .forceLink(linkData)
      .id((d) => (d as SimulationGaphNode).id)
      .distance(nodeDistance)
    let simulation = d3_force
      .forceSimulation(nodeData)
      .force('link', forceLink)
      .force('center', d3_force.forceCenter(width / 2, height / 2))
      .force('charge', d3_force.forceManyBody().strength(-200))
      .force('collision', d3_force.forceCollide().radius(nodeRadius))
      .tick(1000)
    dispatch(setNodes(simulation.nodes()))
    dispatch(setLinks(forceLink.links() as SimulationGaphLinkAndNodes[]))
  }, [])

  useEffect(() => {
    if (activeNode.id !== '') {
      console.log(nodeStack)
      let currentNodeID = activeNode.id
      let prevNodeID = nodeStack[nodeStack.length - 1]
      //find link weight
      let link = links.find(
        (link) =>
          (link.source.id === prevNodeID && link.target.id === currentNodeID) || (link.source.id === currentNodeID && link.target.id === prevNodeID)
      )
      //if link exists update score and clicked/cross totals
      if (link) {
        let newNode = cloneDeep(activeNode)
        newNode.clickedCount++
        let newLink = cloneDeep(link)
        newLink.crossedCount++
        dispatch(pushNode(activeNode.id))
        dispatch(incrementScore(link.weight))
        dispatch(updateNode(newNode))
        dispatch(updateLink(newLink))
      }
      //otherwise if first item in node stack push and update click totals
      else if (nodeStack.length === 0) {
        let newNode = cloneDeep(activeNode)
        newNode.clickedCount++
        dispatch(updateNode(newNode))
        dispatch(pushNode(activeNode.id))
      }
    }
  }, [activeNode])

  useEffect(() => {
    let allNodesClicked = nodes.every((node) => node.clickedCount > 0)
    if (allNodesClicked && nodeStack[0] === nodeStack[nodeStack.length - 1] && nodeStack.length > 0) {
      alert('win!')
    }
  }, [nodeStack])

  const renderNodes = (nodes: SimulationGaphNode[], radius: number): ReactNode[] => {
    let nodeElements: ReactNode[] = []
    nodes.forEach((node) => {
      nodeElements.push(<GaphNode radius={radius} node={node} key={node.id} />)
    })
    return nodeElements
  }

  const renderLinks = (links: SimulationGaphLinkAndNodes[]) => {
    let linkElements: ReactNode[] = []
    links.forEach((link) => {
      linkElements.push(<GaphLink link={link} key={link.source.id + link.target.id} />)
    })
    return linkElements
  }

  return (
    <div className="container">
      <div className="left-nav"></div>
      <div className="game">
        <div className="title-container">
          <h1>GAPHS</h1>
        </div>
        <div className="controls-container">
          <h2>Score: {score}</h2>
        </div>
        <div className="gaph-container">
          <div className="gaph" style={{ width: width, height: height }}>
            <svg viewBox={`0 0 ${width} ${height}`}>
              {renderLinks(links)}
              {renderNodes(nodes, nodeRadius)}
            </svg>
          </div>
        </div>
      </div>
      <div className="right-nav"></div>
    </div>
  )
}
