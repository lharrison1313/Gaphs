export default function GaphEdge(props: any) {
  return (
    <path
      d={`M ${props.node.x} ${props.node.y} L ${props.tonode.x} ${props.tonode.y}`}
      stroke="black"
    />
  )
}
