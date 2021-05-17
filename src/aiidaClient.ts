import React from 'react';
import { QueryClient } from 'react-query'

export const queryClient = new QueryClient()
export const AiidaSettingsContext = React.createContext({baseUrl: "http://0.0.0.0:5000", enabled: true})


export interface IAiidaRestNode {
    ctime: string
    full_type: string
    id: number
    label: string
    mtime: string
    node_type: string
    process_type: string
    user_id: number
    uuid: string
    attributes: {
        process_state?:
        | 'created'
        | 'running'
        | 'waiting'
        | 'finished'
        | 'excepted'
        | 'killed'
        process_label?: string
        exit_status?: number
    }
}

export interface IAiidaRestResponse {
    data: { nodes: IAiidaRestNode[] }
    id: null
    method: "GET" | "POST"
    path: string
    query_string: string
    resource_type: string
    url: string
    url_root: string
}


export async function fetchNodes(baseUrl: string, nodeType: string, page: number): Promise<{ nodes: IAiidaRestNode[], totalCount: number, perPage: number }> {
    const perPage = 20
    // processState: 'attributes.process_state'
    // TODO better url join
    const response = await fetch(`${baseUrl}/api/v4/nodes/page/${page}?perpage=${perPage}&orderby=-mtime&node_type=like=%22${nodeType}%%22&attributes=true&attributes_filter=process_label,process_state,exit_status`)
    // TODO handle errors
    const totalCount = parseInt(response.headers.get('x-total-count') || '0')
    const responseJson = (await response.json()) as IAiidaRestResponse
    return { nodes: responseJson.data.nodes, totalCount, perPage }
}
