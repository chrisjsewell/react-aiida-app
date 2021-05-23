import { render } from '@testing-library/react'

import { OptimadeTable } from './optimadePanel'

it('creates table', async () => {
  const item = {
    type: 'structure',
    id: 'abc',
    attributes: {
      chemical_formula_descriptive: 'NaCl',
      dimension_types: [1, 1, 1],
      nsites: 10
    }
  }
  const { container } = render(<OptimadeTable data={[item]} />)
  expect(container.firstChild).toHaveClass('optimade-table')
})
