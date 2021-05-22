import { render } from '@testing-library/react'

import { IStructureCell } from './structureUtils'
import { StructureTable } from './structureTable'

describe('StructureTable', () => {
  const exampleStructureData = {
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
  }

  it('creates table', async () => {
    const { container } = render(<StructureTable data={exampleStructureData} />)
    expect(container.firstChild).toHaveClass('structure-table')
  })
})
