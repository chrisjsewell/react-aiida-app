import React, { useContext } from 'react'

import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import { useQuery } from 'react-query'

import {
  AiidaSettingsContext,
  getNode,
  uuidPattern
} from '../clients/aiidaClient'
import { useLocalStorage } from '../utils'
import { IStructureData, vectorLength } from './structureUtils'
import { Structure3DViewer } from './structure3DViewer'
import { StructureTable } from './structureTable'

/** Selector for a structure, plus visualisers */
export function StructurePanel(): JSX.Element {
  const aiidaSettings = useContext(AiidaSettingsContext)
  const [rootUUID, setrootUUID] = useLocalStorage(
    'aiida-structure-uuid',
    null as null | string
  )
  const handleUUIDChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setrootUUID(event.target.value)
  }
  const result = useQuery(
    [aiidaSettings.baseUrl, 'node', rootUUID],
    () => getNode(aiidaSettings.baseUrl, rootUUID),
    { enabled: aiidaSettings.baseUrl !== null }
  )
  let view = null as null | JSX.Element
  // check the data is actually StructureData
  if (result.data) {
    if (result.data.attributes.cell) {
      const cell = result.data.attributes.cell
      view = (
        <React.Fragment>
          <Structure3DViewer data={result.data as IStructureData} />
          <Typography gutterBottom align="right">
            X: {vectorLength(cell[0])}; Y: {vectorLength(cell[1])}; Z:{' '}
            {vectorLength(cell[2])}
          </Typography>
          <StructureTable data={result.data as IStructureData} />
        </React.Fragment>
      )
    } else {
      console.error('Data is not from StructureData')
    }
  }

  return (
    <React.Fragment>
      <TextField
        label="StructureData UUID"
        value={rootUUID || ''}
        onChange={handleUUIDChange}
        error={rootUUID ? !uuidPattern.test(rootUUID) : false}
        // helperText={!result.error ? undefined : `${result.error}`}
        fullWidth
      />
      {view}
    </React.Fragment>
  )
}
