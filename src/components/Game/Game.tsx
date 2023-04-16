import React, { ReactNode, useEffect, useState } from 'react'
import './Game.css'
import * as d3_force from 'd3-force'
import { SimulationGaphNode, SimulationGaphLink, SimulationGaphLinkAndNodes } from '../../types/d3-force'
import boundary from 'd3-force-boundary'
import GaphNode from '../GaphNode/GaphNode'
import GaphLink from '../GaphLink/GaphLink'
import generateRandomGraph from '../../utils/generateGraph'
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
import { SpringConfig, useSpring, useSpringRef, animated } from 'react-spring'

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
  const [gameStatus, setGameStatus] = useState(0)
  const [bestScore, setBestScore] = useState(0)
  const [bestPath, setBestPath] = useState(0)

  const width = window.innerWidth > 700 ? 500 : window.innerWidth - 50
  const height = window.innerWidth > 700 ? 450 : width * 0.9
  const nodeRadius = window.innerWidth > 700 ? 20 : 12
  const nodeDistance = window.innerWidth > 700 ? 75 : 45
  const multiBodyForce = window.innerWidth > 700 ? -2000 : -900

  const endGameAnimation = useSpringRef()
  const config: SpringConfig = { duration: 500 }
  const endGameProps = useSpring({
    ref: endGameAnimation,
    from: { height: '0px' },
    config: config,
  })

  const gameGraphs = [
    { nodes: 5, edges: 7 },
    { nodes: 6, edges: 7 },
    { nodes: 6, edges: 8 },
  ]

  //on component mount generate graph and setup game
  useEffect(() => {
    initGame(true)
  }, [])

  //handle node activation game logic
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

  //check end condition
  useEffect(() => {
    let allNodesClicked = nodes.every((node) => node.clickedCount > 0)
    let tooManyClicked = nodes.some((node) => node.clickedCount >= 4)
    if (allNodesClicked && nodeStack[0] === nodeStack[nodeStack.length - 1] && nodeStack.length > 0) {
      clearInterval(timer)
      setGameStatus(1)
      if (score <= bestScore || bestScore === 0) {
        setBestScore(score)
      }
      if (path <= bestPath || bestPath === 0) {
        setBestPath(path)
      }
    } else if (tooManyClicked) {
      clearInterval(timer)
      setGameStatus(2)
    }
  }, [nodeStack])

  //handle end game screen animation
  useEffect(() => {
    if (gameStatus === 0) {
      endGameAnimation.start({ to: { height: `0px` } })
    } else {
      endGameAnimation.start({ to: { height: `${height}px` } })
    }
  }, [gameStatus])

  const initGame = (newGraph: boolean) => {
    let graph
    if (newGraph) {
      let chosenGraph = gameGraphs[Math.floor(Math.random() * gameGraphs.length)]
      graph = generateRandomGraph(chosenGraph.nodes, chosenGraph.edges)
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
      .force('charge', d3_force.forceManyBody().strength(multiBodyForce))
      .force('boundary', boundary(0, 0, width, height))
      .tick(1000)
    dispatch(setNodes(simulation.nodes()))
    dispatch(setLinks(forceLink.links() as SimulationGaphLinkAndNodes[]))
    setGameStatus(0)
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
          <animated.div
            className="game-over"
            style={{ width: width, height: endGameProps.height, backgroundColor: gameStatus === 2 ? '#db3030' : '#276FAB' }}
          >
            {gameStatus === 2 && (
              <>
                <h1>Thats a Gaph!</h1>
                <h3>Remember you cant click the same node 3 times</h3>
              </>
            )}
            {gameStatus === 1 && (
              <>
                <h1>Thats Great!</h1>
                <div>
                  <h3>Score: {score}</h3>
                  <h3>Path: {path}</h3>
                  <h3>Best Score: {bestScore}</h3>
                  <h3>Shortest Path: {bestPath}</h3>
                </div>
              </>
            )}
          </animated.div>
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
