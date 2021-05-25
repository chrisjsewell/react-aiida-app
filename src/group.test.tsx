import { render } from '@testing-library/react'
import fetch from 'jest-fetch-mock'

import { QueryClientProvider, QueryClient } from 'react-query'
import { AiidaSettingsContext } from './clients/aiidaClient'

import { BookmarkItem, GroupTree } from './PageGroups'

beforeEach(() => {
  fetch.resetMocks()
})

describe('Group page', () => {
  const queryClient = new QueryClient()

  const exampleNode = {
    ctime: '',
    full_type: '',
    id: 1,
    label: '',
    mtime: '',
    node_type: '',
    process_type: '',
    user_id: 1,
    uuid: 'uuid1',
    attributes: {}
  }

  it('queries for bookmark nodes', async () => {
    fetch.mockResponseOnce(JSON.stringify({ data: { nodes: [exampleNode] } }))

    render(
      <QueryClientProvider client={queryClient}>
        <AiidaSettingsContext.Provider value={{ baseUrl: 'https://abc/api/v4' }}>
          <BookmarkItem uuid="uuid" initialOpen />
        </AiidaSettingsContext.Provider>
      </QueryClientProvider>
    )

    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch.mock.calls[0][0]).toEqual(
      'https://abc/api/v4/nodes/uuid?attributes=true&extras=true'
    )
  })
  it('queries for groups nodes', async () => {
    fetch.mockResponseOnce(JSON.stringify({ data: { nodes: [exampleNode] } }))

    render(
      <QueryClientProvider client={queryClient}>
        <AiidaSettingsContext.Provider value={{ baseUrl: 'https://abc/api/v4' }}>
          <GroupTree />
        </AiidaSettingsContext.Provider>
      </QueryClientProvider>
    )

    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch.mock.calls[0][0]).toEqual(
      'https://abc/api/v4/groups?orderby=type_string'
    )
  })
})
