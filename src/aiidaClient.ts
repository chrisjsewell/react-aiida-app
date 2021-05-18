import React from 'react';
import { QueryClient } from 'react-query'

export const queryClient = new QueryClient()
export const defaultRestUrl = "http://127.0.0.1:5000/api/v4"
export const AiidaSettingsContext = React.createContext({baseUrl: defaultRestUrl} as {baseUrl: null | string})

export interface IAiidaRestResponse {
    // The base attributes for the rest response
    data: any
    id: null
    method: "GET" | "POST"
    path: string
    query_string: string
    resource_type: string
    url: string
    url_root: string
}

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

export interface IAiidaRestResponseNode extends IAiidaRestResponse  {
    data: { nodes: IAiidaRestNode[] }
}

export interface IAiidaRestNodeStatistics {
    total: number
    ctime_by_day: {[key: string]: number}
    types: {[key: string]: number}
}

export interface IAiidaRestResponseNodeStatistics extends IAiidaRestResponse  {
    data: IAiidaRestNodeStatistics
}


export async function isConnected(baseUrl: string | null): Promise<boolean> {
    if (baseUrl === null) {
        return false
    }
    const response = await fetch(`${baseUrl}`)
    return response.ok
}


export async function getNodes(baseUrl: string | null, nodeType: string, page: number): Promise<null | { nodes: IAiidaRestNode[], totalCount: number, perPage: number }> {
    if (baseUrl === null) {
        return null
    }
    const perPage = 20
    // TODO better url join?
    const response = await fetch(`${baseUrl}/nodes/page/${page}?perpage=${perPage}&orderby=-mtime&node_type=like=%22${nodeType}%%22&attributes=true&attributes_filter=process_label,process_state,exit_status`)
    // TODO handle errors
    const totalCount = parseInt(response.headers.get('x-total-count') || '0')
    const responseJson = (await response.json()) as IAiidaRestResponseNode
    return { nodes: responseJson.data.nodes, totalCount, perPage }
}


export async function getNodeStatistics(baseUrl: string | null): Promise<null | IAiidaRestNodeStatistics> {
    if (baseUrl === null) {
        return null
    }
    const response = await fetch(`${baseUrl}/nodes/statistics/`)
    const responseJson = (await response.json()) as IAiidaRestResponseNodeStatistics
    return responseJson.data
}
