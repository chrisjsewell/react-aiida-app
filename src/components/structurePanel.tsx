import React, { useContext, useState, useRef } from 'react'

import {
  Box,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Tabs,
  Tab,
  TextField,
  Typography
} from '@material-ui/core'

import { useQuery } from 'react-query'
import { ResizableBox, ResizeCallbackData } from 'react-resizable'

import { AiidaSettingsContext, getNode, uuidPattern } from '../clients/aiidaClient'
import { useLocalStorage } from '../hooks'
import { useStyles } from '../styles'
import { IStructureDataAttrs, vectorLength } from './structureUtils'
import { Structure3DViewer } from './structure3DViewer'
import { StructureTable } from './structureTable'
import OptimadeClient from '../clients/optimadeClient'

/** Selector for a structure, plus visualisers */
export function StructurePanel(): JSX.Element {
  const [tabIndex, setTabIndex] = React.useState(0)

  const handleChange = (event: React.ChangeEvent<any>, value: number) => {
    setTabIndex(value)
  }

  return (
    <React.Fragment>
      <Tabs
        value={tabIndex}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        aria-label="full width tabs example"
      >
        <Tab label="AiiDA" />
        <Tab label="Optimade" />
      </Tabs>
      <TabPanel value={tabIndex} index={0}>
        <StructurePanelAiiDA />
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <StructurePanelOptimade />
      </TabPanel>
    </React.Fragment>
  )
}

interface TabPanelProps {
  children?: React.ReactNode
  index: any
  value: any
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

function StructurePanelAiiDA(): JSX.Element {
  const [rootUUID, setrootUUID] = useLocalStorage(
    'aiida-structure-uuid',
    null as null | string
  )
  const handleUUIDChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setrootUUID(event.target.value)
  }

  const aiidaSettings = useContext(AiidaSettingsContext)

  const result = useQuery(
    [aiidaSettings.baseUrl, 'node', rootUUID],
    () => getNode(aiidaSettings.baseUrl, rootUUID),
    { enabled: aiidaSettings.baseUrl !== null }
  )

  let view = null as null | JSX.Element
  let uuidErrorMessage: string | undefined = undefined
  if (result.data) {
    // check the data is actually StructureData
    if (result.data.attributes.cell && result.data.attributes.sites) {
      view = <StructurePanelBase node={result.data.attributes as IStructureDataAttrs} />
    } else {
      uuidErrorMessage = 'UUID is not a StructureData'
    }
  } else if (result.isLoading) {
    view = <CircularProgress />
  } else if (result.isError) {
    uuidErrorMessage = `${result.error}`
  }

  return (
    <React.Fragment>
      <TextField
        label="StructureData UUID"
        value={rootUUID || ''}
        onChange={handleUUIDChange}
        error={rootUUID ? !uuidPattern.test(rootUUID) || !!uuidErrorMessage : false}
        helperText={uuidErrorMessage}
        fullWidth
        style={{ paddingBottom: 10 }}
      />
      {view}
    </React.Fragment>
  )
}

function StructurePanelOptimade(): JSX.Element {
  const classes = useStyles()

  const [provider, setProvider] = useLocalStorage('optimade-structure-provider', '')
  const [id, setID] = useLocalStorage('optimade-structure-id', '')

  const resultProviders = useQuery(['optimade', 'providers'], () =>
    new OptimadeClient().getStructureProviders()
  )
  const resultStructure = useQuery(['optimade', 'structure', provider, id], () =>
    new OptimadeClient().getStructureView(provider, id)
  )

  let providerItems = [] as JSX.Element[]
  if (resultProviders.data) {
    providerItems = resultProviders.data.map(value => (
      <MenuItem value={value.id}>{value.attributes.name}</MenuItem>
    ))
  }

  let view = null as null | JSX.Element
  let uuidErrorMessage: string | undefined = undefined
  if (resultStructure.data?.data) {
    try {
      const data = resultStructure.data.data.data
      const pbc = data.attributes.dimension_types || [1, 1, 1]
      const nodeData = {
        cell: data.attributes.lattice_vectors,
        pbc1: !!pbc[0],
        pbc2: !!pbc[1],
        pbc3: !!pbc[2],
        sites: data.attributes.cartesian_site_positions.map((p, i) => {
          return { position: p, kind_name: data.attributes.species_at_sites[i] }
        }),
        kinds: data.attributes.species.map(s => {
          return {
            name: s.name,
            mass: s.mass || 0,
            symbols: s.chemical_symbols,
            weights: s.concentration
          }
        })
      }
      view = <StructurePanelBase node={nodeData as IStructureDataAttrs} />
    } catch (err) {
      uuidErrorMessage = `Structure parse failed: ${err}`
    }
  } else if (resultStructure.isLoading) {
    view = <CircularProgress />
  } else if (resultStructure.isError) {
    uuidErrorMessage = `${resultStructure.error}`
  }

  return (
    <React.Fragment>
      <Grid container spacing={4} alignItems="center">
        <Grid item sm={6}>
          <FormControl className={classes.formControl} fullWidth>
            <InputLabel id="optimade-provider-view-select">Provider</InputLabel>
            <Select
              id="optimade-provider-view-select"
              value={provider || ''}
              onChange={(event: React.ChangeEvent<{ value: unknown | string }>) => {
                setProvider(!event.target.value ? '' : (event.target.value as string))
              }}
            >
              {providerItems}
            </Select>
          </FormControl>
        </Grid>
        <Grid item sm={6}>
          <TextField
            label="Structure ID"
            value={id}
            onChange={(
              event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
            ) => {
              setID(event.target.value)
            }}
            error={!!uuidErrorMessage}
            helperText={uuidErrorMessage}
            fullWidth
          />
        </Grid>
      </Grid>
      {view}
    </React.Fragment>
  )
}

function StructurePanelBase({ node }: { node: IStructureDataAttrs }): JSX.Element {
  // Structure viewer variables
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

  // TODO set the initial width to the width of the container (and change on window resize)
  // possibly using useLayoutEffect, but how not to get into infinite feedback loop?
  const [viewerSize, setviewerSize] = useState({ height: 200, width: 200 })
  const viewerContainer = useRef() as any

  const cell = node.cell

  return (
    <React.Fragment>
      <Grid container spacing={4}>
        <RepeatSlider name={'a'} value={aImages} setter={setaImages} />
        <RepeatSlider name={'b'} value={bImages} setter={setbImages} />
        <RepeatSlider name={'c'} value={cImages} setter={setcImages} />
      </Grid>
      <div style={{ marginTop: 10, marginBottom: undefined }} ref={viewerContainer}>
        <ResizableBox
          width={viewerSize.width}
          height={viewerSize.height}
          maxConstraints={[
            viewerContainer?.current?.offsetWidth
              ? viewerContainer.current.offsetWidth
              : Infinity,
            Infinity
          ]}
          resizeHandles={['s', 'e', 'se']}
          onResize={(
            e: React.SyntheticEvent<Element, Event>,
            data: ResizeCallbackData
          ) => {
            setviewerSize({
              width: data.size.width,
              height: data.size.height
            })
          }}
        >
          <Structure3DViewer
            data={node}
            images={images}
            withBox={boundingBox}
            width={viewerSize.width}
            height={viewerSize.height}
          />
        </ResizableBox>
      </div>
      <Grid container alignItems="center">
        <Grid item sm={6}>
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
        </Grid>
        <Grid item sm={6}>
          <Typography align="right">
            A: {vectorLength(cell[0])}; B: {vectorLength(cell[1])}; C:{' '}
            {vectorLength(cell[2])}
          </Typography>
        </Grid>
      </Grid>
      <StructureTable data={node} />
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
        onChange={(event: React.ChangeEvent<unknown>, value: number | number[]) => {
          props.setter(value as number)
        }}
      />
    </Grid>
  )
}
