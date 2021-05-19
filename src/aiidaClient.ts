import React from 'react';
import { QueryClient } from 'react-query'

export const queryClient = new QueryClient()
export const defaultRestUrl = "http://127.0.0.1:5000/api/v4"
// TODO move validation to aiidaClient functions?
export const urlPattern = new RegExp('^https?:\\/\\/[^\\?]+$')
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

const uuidPattern = new RegExp('^[-a-zA-Z0-9]+$')

export async function getNode(baseUrl: string | null, uuid: string | null): Promise<null | IAiidaRestNode> {
    if (baseUrl === null || !uuid) {
        return null
    }
    if (!uuidPattern.test(uuid)) {
        throw new TypeError('UUID does not match required format')
    }
    const response = await fetch(`${baseUrl}/nodes/${uuid}?attributes=true&extras=true`)
    const responseJson = (await response.json()) as IAiidaRestResponse
    return responseJson.data?.nodes === undefined ? null : Object.values(responseJson.data?.nodes)[0] as IAiidaRestNode
}

export interface IAiidaRestNodeRepoListItem {
    name: string
    type: "FILE" | "DIRECTORY"
}

export interface IAiidaRestResponseNodeRepoList extends IAiidaRestResponse  {
    data: { repo_list: {[key: number]: IAiidaRestNodeRepoListItem} }
}

export async function getNodeRepoList(baseUrl: string | null, uuid: string | null): Promise<null | IAiidaRestNodeRepoListItem[]> {
    if (baseUrl === null || !uuid) {
        return null
    }
    if (!uuidPattern.test(uuid)) {
        throw new TypeError('UUID does not match required format')
    }
    const response = await fetch(`${baseUrl}/nodes/${uuid}/repo/list`)
    const responseJson = (await response.json()) as IAiidaRestResponseNodeRepoList
    return responseJson.data?.repo_list === undefined ? null : Object.values(responseJson.data?.repo_list) as IAiidaRestNodeRepoListItem[]
}

export interface IAiidaRestNodeLinkItem {
    ctime: string
    full_type: string
    id: number
    label: string
    mtime: string
    node_type: string
    process_type: string
    user_id: number
    uuid: string
    link_label: string
    link_type: string
}

export interface IAiidaRestResponseNodeIncoming extends IAiidaRestResponse  {
    data: { incoming: {[key: number]: IAiidaRestNodeLinkItem} }
}

export async function getNodeIncoming(baseUrl: string | null, uuid: string | null): Promise<null | IAiidaRestNodeLinkItem[]> {
    if (baseUrl === null || !uuid) {
        return null
    }
    if (!uuidPattern.test(uuid)) {
        throw new TypeError('UUID does not match required format')
    }
    // TODO deal with pagination
    const response = await fetch(`${baseUrl}/nodes/${uuid}/links/incoming/page/1`)
    const responseJson = (await response.json()) as IAiidaRestResponseNodeIncoming
    return responseJson.data?.incoming === undefined ? null : Object.values(responseJson.data?.incoming) as IAiidaRestNodeLinkItem[]
}

export interface IAiidaRestResponseNodeOutgoing extends IAiidaRestResponse  {
    data: { outgoing: {[key: number]: IAiidaRestNodeLinkItem} }
}

export async function getNodeOutgoing(baseUrl: string | null, uuid: string | null): Promise<null | IAiidaRestNodeLinkItem[]> {
    if (baseUrl === null || !uuid) {
        return null
    }
    if (!uuidPattern.test(uuid)) {
        throw new TypeError('UUID does not match required format')
    }
    // TODO deal with pagination
    const response = await fetch(`${baseUrl}/nodes/${uuid}/links/outgoing/page/1`)
    const responseJson = (await response.json()) as IAiidaRestResponseNodeOutgoing
    return responseJson.data?.outgoing === undefined ? null : Object.values(responseJson.data?.outgoing) as IAiidaRestNodeLinkItem[]
}
