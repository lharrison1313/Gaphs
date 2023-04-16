import { SimulationGaphNode, SimulationGaphLink } from '../types/d3-force'

export default function generateRandomGraph(numNodes: number, numEdges: number) {
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
