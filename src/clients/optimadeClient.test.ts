import fetch from 'jest-fetch-mock'

import { OptimadeClient } from './optimadeClient'

beforeEach(() => {
  fetch.resetMocks()
})

it('runs getStructureProviders query', async () => {
  fetch.mockResponseOnce(JSON.stringify({}))

  const client = new OptimadeClient()
  const providers = await client.getStructureProviders()

  expect(providers).toHaveLength(5)
})

it('runs getStructures query', async () => {
  fetch.mockResponseOnce(JSON.stringify({ data: { nodes: { 0: 'result' } } }))

  const client = new OptimadeClient()
  await client.getStructures('cod')

  expect(fetch).toHaveBeenCalledTimes(1)
  expect(fetch.mock.calls[0][0]).toEqual(
    'https://cors.optimade.org/www.crystallography.net/cod/optimade/v1/structures?page_number=1&page_limit=10&sort=attributes.chemical_formula_descriptive&response_fields=last_modified,dimension_types,nsites,chemical_formula_descriptive'
  )
})

it('runs getStructureView query', async () => {
  fetch.mockResponseOnce(JSON.stringify({ data: { nodes: { 0: 'result' } } }))

  const client = new OptimadeClient()
  await client.getStructureView('cod', 'myid')

  expect(fetch).toHaveBeenCalledTimes(1)
  expect(fetch.mock.calls[0][0]).toEqual(
    'https://cors.optimade.org/www.crystallography.net/cod/optimade/v1/structures/myid?response_fields=dimension_types,lattice_vectors,cartesian_site_positions,species,species_at_sites'
  )
})
