import { render } from '@testing-library/react'
import fetch from 'jest-fetch-mock'

import { QueryClientProvider, QueryClient } from 'react-query'
import { AiidaNodeTree } from './nodeList'

beforeEach(() => {
  fetch.resetMocks()
})

describe('AiidaNodeTree', () => {
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

  const exampleProcessNode = {
    ctime: '',
    full_type: '',
    id: 1,
    label: '',
    mtime: '',
    node_type: '',
    process_type: '',
    user_id: 1,
    uuid: 'uuid1',
    attributes: {
      process_state: 'finished',
      process_label: 'label',
      exit_status: 0
    }
  }

  it('queries for nodes', async () => {
    fetch.mockResponseOnce(
      JSON.stringify({ data: { nodes: [exampleNode, exampleProcessNode] } })
    )

    render(
      <QueryClientProvider client={queryClient}>
        <AiidaNodeTree nodePrefix="" />
      </QueryClientProvider>
    )

    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch.mock.calls[0][0]).toEqual(
      'http://127.0.0.1:5000/api/v4/nodes/page/1?perpage=20&orderby=-mtime&attributes=true&attributes_filter=process_label,process_state,exit_status'
    )
  })
})
