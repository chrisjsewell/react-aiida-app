import React, { useContext, useEffect, useRef } from 'react'

import { Theme, useTheme } from '@material-ui/core/styles'

import ForceGraph2D, {
  NodeObject,
  LinkObject
  // ForceGraphMethods
} from 'react-force-graph-2d'
import { forceCollide } from 'd3-force'
import { useQuery } from 'react-query'
import { SizeMe } from 'react-sizeme'

import {
  AiidaSettingsContext,
  IAiidaRestNodeLinkItem,
  getNodeOutgoing,
  getNodeIncoming
} from '../clients/aiidaClient'

export type DagType = 'td' | 'bu' | 'lr' | 'rl' | 'radialout' | 'radialin'

interface Node2dObject extends NodeObject {
  name?: string
  label?: string
  color?: string
  fillColor?: string
  val?: number
  __bckgDimensions?: number[]
}

export function AiidaProvenanceGraph({
  nodeUUID,
  dagMode,
  dagLevelDistance
}: {
  nodeUUID: string | null
  dagMode: DagType
  dagLevelDistance: number
}): JSX.Element {
  const theme = useTheme()
  const fgRef = useRef()
  const aiidaSettings = useContext(AiidaSettingsContext)
  const resultIncoming = useQuery(
    [aiidaSettings.baseUrl, 'nodeIncoming', nodeUUID],
    () => getNodeIncoming(aiidaSettings.baseUrl, nodeUUID),
    { enabled: aiidaSettings.baseUrl !== null }
  )
  const resultOutgoing = useQuery(
    [aiidaSettings.baseUrl, 'nodeOutgoing', nodeUUID],
    () => getNodeOutgoing(aiidaSettings.baseUrl, nodeUUID),
    { enabled: aiidaSettings.baseUrl !== null }
  )

  useEffect(() => {
    // add collision force
    const fg = fgRef.current as undefined | any // ForceGraphMethods
    if (fg !== undefined) {
      // Deactivate existing forces
      fg.d3Force('charge', null)
      fg.d3Force('collision', forceCollide(15))
      // fg.d3Force('box' ...
    }
  }, [resultIncoming, resultOutgoing])

  const rootNode = {
    id: 'root',
    name: 'root',
    label: 'ROOT',
    val: 2,
    color: 'red',
    fillColor: theme.palette.action.selected
  } as Node2dObject
  const nodes = [rootNode] as Node2dObject[]
  const links = [] as LinkObject[]

  if (resultIncoming.data) {
    nodes.push(
      ...resultIncoming.data.map(node => {
        return createNodeData(node, theme)
      })
    )
    links.push(
      ...resultIncoming.data.map(node => {
        return {
          target: 'root',
          source: `${node.id}`,
          name: `${node.link_label}`,
          color: theme.palette.text.secondary
        }
      })
    )
  }
  if (resultOutgoing.data) {
    nodes.push(
      ...resultOutgoing.data.map(node => {
        return createNodeData(node, theme)
      })
    )
    links.push(
      ...resultOutgoing.data.map(node => {
        return {
          source: 'root',
          target: `${node.id}`,
          name: `${node.link_label}`,
          color: theme.palette.text.secondary
        }
      })
    )
  }

  const data = {
    nodes: nodes,
    links: links
  }
  return (
    <SizeMe>
      {({ size }) => (
        <ForceGraph2D
          ref={fgRef}
          graphData={data}
          width={size.width === null ? undefined : size.width}
          height={size.height === null ? undefined : size.height}
          dagMode={dagMode}
          dagLevelDistance={dagLevelDistance}
          nodeCanvasObject={nodeCanvasObject}
          linkDirectionalArrowLength={3.5}
          linkDirectionalArrowRelPos={1}
        />
      )}
    </SizeMe>
  )
}

function createNodeData(node: IAiidaRestNodeLinkItem, theme: Theme): Node2dObject {
  const node_type = node.node_type.split('.')
  node_type.pop()
  return {
    id: `${node.id}`,
    name: `${node.id}${node.process_type ? ', ' + node.process_type : ''}`,
    label: node_type.pop(),
    val: 40,
    color:
      theme.palette.type === 'dark'
        ? theme.palette.primary.light
        : theme.palette.primary.dark,
    fillColor: theme.palette.action.selected
  }
}

function nodeCanvasObject(
  node: Node2dObject,
  ctx: CanvasRenderingContext2D,
  globalScale: number
): void {
  const label = `${node.label || ''}`
  const fontSize = 12 / globalScale
  ctx.font = `${fontSize}px Sans-Serif`
  const textWidth = ctx.measureText(label).width
  const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.5) // some padding

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)'
  if (node.x !== undefined && node.y !== undefined) {
    if (node.fillColor) {
      ctx.fillStyle = node.fillColor
      ctx.fillRect(
        node.x - bckgDimensions[0] / 2,
        node.y - bckgDimensions[1] / 2,
        bckgDimensions[0],
        bckgDimensions[1]
      )
    }
    ctx.strokeRect(
      node.x - bckgDimensions[0] / 2,
      node.y - bckgDimensions[1] / 2,
      bckgDimensions[0],
      bckgDimensions[1]
    )
    ctx.fillStyle = node.color || 'white'
    ctx.fillText(label, node.x, node.y)
  }

  node.__bckgDimensions = bckgDimensions // to re-use in nodePointerAreaPaint
}
