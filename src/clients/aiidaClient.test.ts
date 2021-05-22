import fetch from 'jest-fetch-mock'

import {
  getNodeStatistics,
  getNode,
  getNodes,
  getNodeRepoList,
  getNodeIncoming,
  getNodeOutgoing
} from './aiidaClient'

beforeEach(() => {
  fetch.resetMocks()
})

it('runs getNodeStatistics query', async () => {
  fetch.mockResponseOnce(JSON.stringify({ data: { nodes: { 0: 'result' } } }))

  await getNodeStatistics('url')

  expect(fetch).toHaveBeenCalledTimes(1)
  expect(fetch.mock.calls[0][0]).toEqual('url/nodes/statistics/')
})

it('runs getNode query', async () => {
  fetch.mockResponseOnce(JSON.stringify({ data: { nodes: { 0: 'result' } } }))

  const output = await getNode('url', 'uuid')

  expect(fetch).toHaveBeenCalledTimes(1)
  expect(fetch.mock.calls[0][0]).toEqual(
    'url/nodes/uuid?attributes=true&extras=true'
  )
  expect(output).toEqual('result')
})

it('runs getNodes query', async () => {
  fetch.mockResponseOnce(JSON.stringify({ data: { nodes: { 0: 'result' } } }))

  await getNodes('url', 'nodetype', 1)

  expect(fetch).toHaveBeenCalledTimes(1)
  expect(fetch.mock.calls[0][0]).toEqual(
    'url/nodes/page/1?perpage=20&orderby=-mtime&node_type=like=%22nodetype%%22&attributes=true&attributes_filter=process_label,process_state,exit_status'
  )
})

it('runs getNodeRepoList query', async () => {
  fetch.mockResponseOnce(JSON.stringify({ data: { nodes: { 0: 'result' } } }))

  await getNodeRepoList('url', 'uuid')

  expect(fetch).toHaveBeenCalledTimes(1)
  expect(fetch.mock.calls[0][0]).toEqual('url/nodes/uuid/repo/list')
})

it('runs getNodeIncoming query', async () => {
  fetch.mockResponseOnce(JSON.stringify({ data: { nodes: { 0: 'result' } } }))

  await getNodeIncoming('url', 'uuid')

  expect(fetch).toHaveBeenCalledTimes(1)
  expect(fetch.mock.calls[0][0]).toEqual('url/nodes/uuid/links/incoming/page/1')
})

it('runs getNodeOutgoing query', async () => {
  fetch.mockResponseOnce(JSON.stringify({ data: { nodes: { 0: 'result' } } }))

  await getNodeOutgoing('url', 'uuid')

  expect(fetch).toHaveBeenCalledTimes(1)
  expect(fetch.mock.calls[0][0]).toEqual('url/nodes/uuid/links/outgoing/page/1')
})
