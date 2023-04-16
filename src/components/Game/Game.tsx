import React, { ReactNode, useEffect, useState } from 'react'
import './Game.css'
import * as d3_force from 'd3-force'
import { SimulationGaphNode, SimulationGaphLink, SimulationGaphLinkAndNodes } from '../../types/d3-force'
import boundary from 'd3-force-boundary'
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
  resetGame,
  selectPath,
  incrementPath,
} from './gameSlice'
import { cloneDeep } from 'lodash'

export default function Game() {
  const dispatch = useAppDispatch()

  const path = useAppSelector(selectPath)
  const score = useAppSelector(selectScore)
  const nodes: SimulationGaphNode[] = useAppSelector(selectNodes)
  const links: SimulationGaphLinkAndNodes[] = useAppSelector(selectLinks)
  const nodeStack: string[] = useAppSelector(selectNodeStack)
  const activeNode: SimulationGaphNode = useAppSelector(selectActiveNode)
  type Graph = { nodes: SimulationGaphNode[]; edges: SimulationGaphLink[] }

  const [timer, setTimer] = useState(0)
  const [emptyGraph, setEmptyGraph] = useState<Graph>({ nodes: [], edges: [] })

  const width = 500
  const height = 450
  const nodeRadius = 20
  const nodeDistance = 75

  useEffect(() => {
    initGame(true)
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
        dispatch(incrementPath(link.weight))
        dispatch(updateNode(newNode))
        dispatch(updateLink(newLink))
      }
      //otherwise if first item in node stack push and update click totals
      else if (nodeStack.length === 0) {
        let newNode = cloneDeep(activeNode)
        newNode.clickedCount++
        dispatch(updateNode(newNode))
        dispatch(pushNode(activeNode.id))
        //start timer that increments score every second
        let timerID = window.setInterval(() => {
          dispatch(incrementScore(1))
        }, 1000)
        setTimer(timerID)
      }
    }
  }, [activeNode])

  useEffect(() => {
    let allNodesClicked = nodes.every((node) => node.clickedCount > 0)
    if (allNodesClicked && nodeStack[0] === nodeStack[nodeStack.length - 1] && nodeStack.length > 0) {
      //stop the timer
      clearInterval(timer)
      //victory
      alert('win!')
    }
  }, [nodeStack])

  const initGame = (newGraph: boolean) => {
    let graph
    if (newGraph) {
      graph = generateRandomGraph(6, 7)
      setEmptyGraph(graph)
    } else {
      graph = emptyGraph
    }

    let nodeData: SimulationGaphNode[] = graph.nodes
    let linkData: SimulationGaphLink[] = graph.edges
    let forceLink = d3_force
      .forceLink(linkData)
      .id((d) => (d as SimulationGaphNode).id)
      .distance(nodeDistance)
    let simulation = d3_force
      .forceSimulation(nodeData)
      .force('link', forceLink)
      .force('center', d3_force.forceCenter(width / 2, height / 2))
      .force('collision', d3_force.forceCollide().radius(nodeRadius))
      .force('charge', d3_force.forceManyBody().strength(-2000))
      .force('boundary', boundary(0, 0, width, height))
      .tick(1000)
    dispatch(setNodes(simulation.nodes()))
    dispatch(setLinks(forceLink.links() as SimulationGaphLinkAndNodes[]))
  }

  const handleResetGame = () => {
    clearInterval(timer)
    dispatch(resetGame())
    initGame(false)
  }

  const handleNewGame = () => {
    clearInterval(timer)
    dispatch(resetGame())
    initGame(true)
  }

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
          <div className="controls-left">
            <h2 className="controls-header">Score: {score}</h2>
            <h2 className="controls-header">Path: {path}</h2>
          </div>
          <div className="controls-right">
            <div className="button" onClick={handleResetGame}>
              Restart
            </div>
            <div className="button" onClick={handleNewGame}>
              New
            </div>
          </div>
        </div>
        <div className="gaph-container">
          <div className="gaph" style={{ width: width, height: height }}>
            <svg viewBox={`0 0 ${width} ${height}`}>
              {renderLinks(links)}
              {renderNodes(nodes, nodeRadius)}
            </svg>
          </div>
        </div>
        <div className="rules-container">
          <p>
            <b>How To Play:</b> The goal of the game is to find the shortest possible route that visits each node and returns back to the origin node.
          </p>
          <ul>
            <li>
              <b>Choose your destiny:</b> You may start at any node of your choice.
            </li>
            <li>
              <b>Dont get greedy:</b> You may not visit the same node more than 3 times unless its the final visit to the origin node.
            </li>
            <li>
              <b>Time is of the essence:</b> Each second you waste counts against your score.
            </li>
          </ul>
        </div>
      </div>
      <div className="right-nav"></div>
    </div>
  )
}

function generateRandomGraph(numNodes: number, numEdges: number) {
  let nodes: SimulationGaphNode[] = []
  let edges: SimulationGaphLink[] = []
  let alphabet = Array.from('abcdefghijklmnopqrstuvwxyz')
  let possibleEdges: { source: string; target: string }[] = []

  // Create nodes with random IDs
  for (let i = 0; i < numNodes; i++) {
    let nodeId = alphabet.splice(Math.floor(Math.random() * alphabet.length), 1)[0]
    nodes.push({ id: nodeId, clickedCount: 0 })
  }

  // Create list of all possible edge source and target pairs
  for (let i = 0; i < nodes.length; i++) {
    for (let j = 0; j < nodes.length; j++) {
      if (i !== j) {
        let source = nodes[i].id
        let target = nodes[j].id

        // Exclude pairs with the same source and target nodes
        if (source !== target && !possibleEdges.some((edge) => edge.source === target && edge.target === source)) {
          possibleEdges.push({ source: source, target: target })
        }
      }
    }
  }

  // Create edges with random weights
  for (let i = 0; i < numEdges; i++) {
    // Choose a random index from the list of possible edges
    let randomIndex = Math.floor(Math.random() * possibleEdges.length)

    // Get the source and target from the chosen edge
    let source = possibleEdges[randomIndex].source
    let target = possibleEdges[randomIndex].target

    // Remove the chosen edge from the list of possible edges
    possibleEdges.splice(randomIndex, 1)

    // Add the edge to the edges array with a random weight
    let weight = Math.floor(Math.random() * 10) + 1
    let edge = { source: source, target: target, crossedCount: 0, weight: weight }
    edges.push(edge)
  }

  //prune ophaned nodes
  let finalNodes: SimulationGaphNode[] = []
  nodes.forEach((node) => {
    if (edges.findIndex((edge) => edge.source === node.id || edge.target === node.id) > -1) {
      finalNodes.push(node)
    }
  })

  return { nodes: finalNodes, edges: edges }
}
