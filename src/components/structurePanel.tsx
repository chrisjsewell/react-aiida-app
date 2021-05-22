import React, { useContext, useState } from 'react'

import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Grid from '@material-ui/core/Grid'
import Slider from '@material-ui/core/Slider'
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
  const [boundingBox, setboundingBox] = useState(true)
  const [aImages, setaImages] = useState(1)
  const [bImages, setbImages] = useState(1)
  const [cImages, setcImages] = useState(1)
  const images = [] as [number, number, number][]
  for (const an of Array.from(Array(aImages).keys())) {
    for (const bn of Array.from(Array(bImages).keys())) {
      for (const cn of Array.from(Array(cImages).keys())) {
        images.push([an, bn, cn])
      }
    }
  }

  let view = null as null | JSX.Element
  // check the data is actually StructureData
  if (result.data) {
    if (result.data.attributes.cell) {
      const cell = result.data.attributes.cell
      view = (
        <React.Fragment>
          <Grid container spacing={4}>
            <RepeatSlider name={'a'} value={aImages} setter={setaImages} />
            <RepeatSlider name={'b'} value={bImages} setter={setbImages} />
            <RepeatSlider name={'c'} value={cImages} setter={setcImages} />
          </Grid>
          <div style={{ marginTop: 10, marginBottom: undefined }}>
            <Structure3DViewer
              data={result.data as IStructureData}
              images={images}
              withBox={boundingBox}
            />
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  checked={boundingBox}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setboundingBox(event.target.checked)
                  }}
                />
              }
              label="Bounding box"
              labelPlacement="end"
            />
          </div>
          <Typography gutterBottom align="right">
            A: {vectorLength(cell[0])}; B: {vectorLength(cell[1])}; C:{' '}
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
        style={{ paddingBottom: 10 }}
      />
      {view}
    </React.Fragment>
  )
}

function RepeatSlider(props: {
  name: string
  value: number
  setter: any
}): JSX.Element {
  return (
    <Grid item sm={4}>
      <Typography>
        repeat <i>{props.name}</i>
      </Typography>
      <Slider
        defaultValue={props.value}
        aria-labelledby="discrete-slider"
        valueLabelDisplay="auto"
        step={1}
        marks
        min={1}
        max={10}
        onChange={(
          event: React.ChangeEvent<unknown>,
          value: number | number[]
        ) => {
          props.setter(value as number)
        }}
      />
    </Grid>
  )
}
