// Implementation of https://github.com/Materials-Consortia/OPTIMADE/blob/master/optimade.rst

// we take the types from https://github.com/tilde-lab/optimade-client/blob/main/src/types.ts
// but the actual API is not exactly what we want
import { Types } from 'optimade'

// This is the whole process:
// 1. Get provider JSON (https://providers.optimade.org/providers.json)
// 2. Get version from `meta.api_version`
// 3. For each provider in `data`, if they have a non-null `attributes.base_url`
// 4. Go to `attributes.base_url` + version + '/info' and check they have 'links' in attributes.available_endpoints, if so
// 5. Go to `attributes.base_url` + version + '/links' go though `data` to find `attributes.base_url` (but note the last one is usually a backward link to https://providers.optimade.org)
// 6. For these now go to `attributes.base_url` + version + '/structures'

// but to start we will skip a few steps, and provide only some know final URLS
const StructureURLs = {
  cod: 'https://www.crystallography.net/cod/optimade',
  omdb: 'http://optimade.openmaterialsdb.se/',
  tcod: 'https://www.crystallography.net/tcod/optimade',
  oqmd: 'http://oqmd.org/optimade',
  odbx: 'https://optimade.odbx.science'
} as { [key: string]: string }

export const formulaPattern = new RegExp('^[\\sa-zA-Z0-9]+$')

function appendUrl(url: string, tail: string): string {
  return url.replace(/\/$/, '') + '/' + tail.replace(/^\//, '')
}

// A number of optimade providers do not supply the header `Access-Control-Allow-Origin $http_origin` in their responses
// So we must go through a proxy (see https://javascript.info/fetch-crossorigin)
function addCorsProxy(url: string, proxy = 'https://cors.optimade.org/'): string {
  return appendUrl(proxy, url.replace(/^https?:\/\//, ''))
}

function getApiVersionPath(providers: Types.ProvidersResponse): string {
  if (!providers.meta?.api_version) {
    return ''
  }
  return `/v${providers.meta.api_version.charAt(0)}`
}

function providersResponse2Map(providers: Types.ProvidersResponse): Types.ProvidersMap {
  return providers.data.reduce((prev, current) => {
    prev[current.id] = current
    return prev
  }, {} as Types.ProvidersMap)
}

export interface IStructureViewResponse {
  data: {
    type: string
    id: string
    attributes: {
      dimension_types: [number, number, number]
      lattice_vectors: [
        [number, number, number],
        [number, number, number],
        [number, number, number]
      ]
      cartesian_site_positions: [number, number, number][]
      species: {
        name: string
        chemical_symbols: string[]
        concentration: number[]
        mass?: number
        original_name?: string
      }[]
      species_at_sites: string[]
    }
  }
  links?: Types.Links
  meta?: Types.Meta
}

export class OptimadeClient {
  // Class for interfacing with Optimade

  private providers: Types.ProvidersResponse = defaultProviders
  private versionPath: string

  constructor(providers?: Types.ProvidersResponse) {
    if (providers) {
      this.providers = providers
    }
    this.versionPath = getApiVersionPath(this.providers)
  }

  async getStructureProviders(): Promise<Types.Provider[]> {
    const providers = providersResponse2Map(this.providers)
    return new Promise(function (resolve) {
      resolve(Object.keys(StructureURLs).map(value => providers[value]))
    })
  }

  async getStructures(
    providerId?: string,
    filterFormula: string | null = null,
    exactFilter = false,
    page = 1,
    pageLimit = 10
  ): Promise<{
    structures: Types.Structure[]
    url?: string
    total?: number
  }> {
    // Note COD errors for a page limit greater than 10
    if (!providerId) {
      return { structures: [] }
    }
    const urlBase = addCorsProxy(StructureURLs[providerId]) // TODO if does not exist
    const urlFull = appendUrl(appendUrl(urlBase, this.versionPath), '/structures')

    // see https://github.com/Materials-Consortia/OPTIMADE/blob/master/optimade.rst#the-filter-language-syntax
    let filter = ''
    if (!filterFormula) {
    } else if (!formulaPattern.test(filterFormula)) {
      console.error(`Formula filter disallowed: ${filterFormula}`)
    } else if (exactFilter) {
      filter = `&filter=chemical_formula_descriptive%20=%20%22${filterFormula}%22`
    } else {
      filter = `&filter=chemical_formula_descriptive%20CONTAINS%20%22${filterFormula}%22`
    }
    const fields = 'last_modified,dimension_types,nsites,chemical_formula_descriptive'

    const response = await fetch(
      `${urlFull}?page_number=${page}&page_limit=${pageLimit}${filter}&sort=attributes.chemical_formula_descriptive&response_fields=${fields}`,
      { headers: { origin: 'https://chrisjsewell.github.io/react-aiida-app' } } // required for the cors proxy
    )
    const responseJson = (await response.json()) as Types.StructuresResponse

    return {
      url: response.url,
      structures: responseJson.data,
      total: responseJson?.meta?.data_returned
    }
  }

  /** Return single structure with attributes required for 3D rendering */
  async getStructureView(
    providerId: string,
    structureId: string
  ): Promise<{
    data: IStructureViewResponse
    url?: string
  } | null> {
    if (!providerId || !structureId) {
      return null
    }
    const urlBase = addCorsProxy(StructureURLs[providerId]) // TODO if does not exist
    const urlFull = appendUrl(
      appendUrl(urlBase, this.versionPath),
      `/structures/${structureId}`
    )

    const fields =
      'dimension_types,lattice_vectors,cartesian_site_positions,species,species_at_sites'

    const response = await fetch(
      `${urlFull}?response_fields=${fields}`,
      { headers: { origin: 'https://chrisjsewell.github.io/react-aiida-app' } } // required for the cors proxy
    )
    const responseJson = (await response.json()) as IStructureViewResponse

    return {
      url: response.url,
      data: responseJson
    }
  }
}

// <link>/structures/<id>?response_fields=lattice_vectors,cartesian_site_positions,structure_features,species,species_at_sites

// Copied from https://providers.optimade.org/providers.json
const defaultProviders = {
  meta: {
    api_version: '1.0.0',
    query: {
      representation: '/links'
    },
    more_data_available: false,
    schema: 'https://schemas.optimade.org/openapi/v1.0/optimade_index.json',
    data_returned: 0,
    data_available: 0
  },
  data: [
    {
      type: 'links',
      id: 'aiida',
      attributes: {
        name: 'AiiDA',
        description:
          'Automated Interactive Infrastructure and Database for Computational Science (AiiDA)',
        base_url: null,
        homepage: 'http://www.aiida.net',
        link_type: 'external'
      }
    },
    {
      type: 'links',
      id: 'aflow',
      attributes: {
        name: 'AFLOW',
        description:
          'Automatic FLOW (AFLOW) database for computational materials science',
        base_url: 'https://providers.optimade.org/index-metadbs/aflow',
        homepage: 'http://aflow.org',
        link_type: 'external'
      }
    },
    {
      type: 'links',
      id: 'cod',
      attributes: {
        name: 'Crystallography Open Database',
        description:
          'Open-access collection of crystal structures of organic, inorganic, metal-organics compounds and minerals, excluding biopolymers',
        base_url: 'http://providers.optimade.org/index-metadbs/cod',
        homepage: 'https://www.crystallography.net/cod',
        link_type: 'external'
      }
    },
    {
      type: 'links',
      id: 'exmpl',
      attributes: {
        name: 'Example provider',
        description:
          'Provider used for examples, not to be assigned to a real database',
        base_url: 'http://providers.optimade.org/index-metadbs/exmpl',
        homepage: 'https://example.com',
        link_type: 'external'
      }
    },
    {
      type: 'links',
      id: 'httk',
      attributes: {
        name: 'The High-Throughput Toolkit',
        description:
          'Prefix for implementation-specific identifiers used in the httk implementation at http://httk.org/',
        base_url: null,
        homepage: null,
        link_type: 'external'
      }
    },
    {
      type: 'links',
      id: 'matcloud',
      attributes: {
        name: 'MatCloud',
        description:
          'A high-throughput computing platform integrating data, simulation and supercomputing.',
        base_url: 'https://providers.optimade.org/index-metadbs/matcloud',
        homepage: 'http://matcloud.cnic.cn',
        link_type: 'external'
      }
    },
    {
      type: 'links',
      id: 'mcloud',
      attributes: {
        name: 'Materials Cloud',
        description:
          'A platform for Open Science built for seamless sharing of resources in computational materials science',
        base_url: 'https://www.materialscloud.org/optimade',
        homepage: 'https://www.materialscloud.org',
        link_type: 'external'
      }
    },
    {
      type: 'links',
      id: 'mp',
      attributes: {
        name: 'The Materials Project',
        description:
          'An open database of computed materials properties to accelerate materials discovery and design',
        base_url: 'http://providers.optimade.org/index-metadbs/mp',
        homepage: 'https://www.materialsproject.org',
        link_type: 'external'
      }
    },
    {
      type: 'links',
      id: 'mpds',
      attributes: {
        name: 'Materials Platform for Data Science',
        description:
          'A highly curated Pauling File dataset based on ~0.5M publications and backing up Springer Materials, ICDD PDF, ASM APD, MedeA, Pearson Crystal Data, AtomWork Advanced, etc.',
        base_url: 'https://providers.optimade.org/index-metadbs/mpds',
        homepage: 'https://mpds.io',
        link_type: 'external'
      }
    },
    {
      type: 'links',
      id: 'nmd',
      attributes: {
        name: 'novel materials discovery (NOMAD)',
        description: 'A FAIR data sharing platform for materials science data',
        base_url: 'https://nomad-lab.eu/prod/rae/optimade/index',
        homepage: 'https://nomad-lab.eu',
        link_type: 'external'
      }
    },
    {
      type: 'links',
      id: 'odbx',
      attributes: {
        name: 'open database of xtals',
        description:
          'A public database of crystal structures mostly derived from ab initio structure prediction from the group of Dr Andrew Morris at the University of Birmingham https://ajm143.github.io',
        base_url: 'https://optimade-index.odbx.science',
        homepage: 'https://odbx.science',
        link_type: 'external'
      }
    },
    {
      type: 'links',
      id: 'omdb',
      attributes: {
        name: 'Open Materials Database',
        description:
          'The Open Materials Database (omdb) is a database of materials properties maintained by the developers of the High-Throughput Toolkit (httk). It enables easy access to useful materials data, in particular via programmatic interaction using this toolkit.',
        base_url: 'https://optimade-index.openmaterialsdb.se',
        homepage: 'http://openmaterialsdb.se',
        link_type: 'external'
      }
    },
    {
      type: 'links',
      id: 'optimade',
      attributes: {
        name: 'OPTIMADE implementations and libraries',
        description:
          'Prefix for implementation-specific identifiers used in API implementations and libraries provided at https://github.com/Materials-Consortia',
        base_url: null,
        homepage: 'https://www.optimade.org',
        link_type: 'external'
      }
    },
    {
      type: 'links',
      id: 'oqmd',
      attributes: {
        name: 'The Open Quantum Materials Database (OQMD)',
        description:
          'The OQMD is a database of DFT calculated thermodynamic and structural properties of materials',
        base_url: 'http://providers.optimade.org/index-metadbs/oqmd',
        homepage: 'http://oqmd.org',
        link_type: 'external'
      }
    },
    {
      type: 'links',
      id: 'jarvis',
      attributes: {
        name: 'Joint Automated Repository for Various Integrated Simulations (JARVIS)',
        description:
          'JARVIS is a repository designed to automate materials discovery using classical force-field, density functional theory, machine learning calculations and experiments.',
        base_url: null,
        homepage: 'https://jarvis.nist.gov',
        link_type: 'external'
      }
    },
    {
      type: 'links',
      id: 'pcod',
      attributes: {
        name: 'Predicted Crystallography Open Database',
        description: '',
        base_url: null,
        homepage: null,
        link_type: 'external'
      }
    },
    {
      type: 'links',
      id: 'tcod',
      attributes: {
        name: 'Theoretical Crystallography Open Database',
        description:
          'Open-access collection of theoretically calculated or refined crystal structures of organic, inorganic, metal-organic compounds and minerals, excluding biopolymers',
        base_url: 'http://providers.optimade.org/index-metadbs/tcod',
        homepage: 'https://www.crystallography.net/tcod',
        link_type: 'external'
      }
    }
  ]
} as Types.ProvidersResponse

export default OptimadeClient
