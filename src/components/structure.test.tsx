import { render } from '@testing-library/react'
import fetch from 'jest-fetch-mock'

import { QueryClientProvider, QueryClient } from 'react-query'

import { IStructureCell } from './structureUtils'
import { StructureTable } from './structureTable'
import { Structure3DViewer } from './structure3DViewer'
import { StructurePanelAiiDA, StructurePanelOptimade } from './structurePanel'

describe('structure components', () => {
  const exampleStructureData = {
    cell: [
      [0, 0, 1],
      [0, 1, 0],
      [0, 0, 1]
    ] as IStructureCell,
    kinds: [
      {
        name: 'He',
        mass: 1,
        symbols: ['He'],
        weights: [1]
      }
    ],
    pbc1: true,
    pbc2: true,
    pbc3: true,
    sites: [
      {
        kind_name: 'He',
        position: [0, 0, 0] as [number, number, number]
      }
    ]
  }

  it('creates table', async () => {
    const { container } = render(<StructureTable data={exampleStructureData} />)
    expect(container.firstChild).toHaveClass('structure-table')
  })
  // TODO this does not actually render the threejs scene
  // tried using @react-three/test-renderer (see https://codesandbox.io/s/testing-forked-ptqr2?file=/src/App.test.js:164-170)
  // but getting react Warning about mocking the scheduler, and nothing in the output scene
  it('creates 3d viewer', async () => {
    const { container } = render(<Structure3DViewer data={exampleStructureData} />)
    expect(container.firstChild).toHaveClass('structure-3d-viewer')
  })
})

describe('structure panels', () => {
  beforeEach(() => {
    fetch.resetMocks()
  })
  const queryClient = new QueryClient()
  it('creates StructurePanelAiiDA', async () => {
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <StructurePanelAiiDA />
      </QueryClientProvider>
    )

    expect(fetch).toHaveBeenCalledTimes(0)
  })
  it('creates StructurePanelOptimade', async () => {
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <StructurePanelOptimade />
      </QueryClientProvider>
    )
    expect(fetch).toHaveBeenCalledTimes(0)
  })
})
