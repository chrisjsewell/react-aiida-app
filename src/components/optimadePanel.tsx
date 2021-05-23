import React, { useState } from 'react'

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip
} from '@material-ui/core'
import { Launch } from '@material-ui/icons'
import { Alert, Pagination } from '@material-ui/lab'

import { useQuery } from 'react-query'

import { useStyles } from '../styles'
import OptimadeClient, { formulaPattern } from '../clients/optimadeClient'
import { Types } from 'optimade'

export function OptimadePanel(): JSX.Element {
  const classes = useStyles()
  const resultProviders = useQuery(['optimade', 'providers'], () =>
    new OptimadeClient().getStructureProviders()
  )

  const [provider, setProvider] = useState(undefined as undefined | string)
  const [formulaFilter, setformulaFilter] = useState(null as null | string)
  const [exactFilter, setexactFilter] = useState(false)
  const [page, setPage] = useState(1)
  const pageLimit = 10
  const resultStructures = useQuery(
    ['optimade', 'structures', provider, formulaFilter, exactFilter, page],
    () =>
      new OptimadeClient().getStructures(
        provider,
        formulaFilter,
        exactFilter,
        page,
        pageLimit
      ),
    { keepPreviousData: true }
  )

  let items = [] as JSX.Element[]
  if (resultProviders.data) {
    items = resultProviders.data.map(value => (
      <MenuItem value={value.id}>
        <Box display="flex" alignItems="center">
          <Tooltip title={<p>{value.attributes.description}</p>}>
            <span>{value.attributes.name} </span>
          </Tooltip>
          {value.attributes.homepage ? (
            <a href={value.attributes.homepage} target="_blank" rel="noopener">
              <Launch />
            </a>
          ) : null}
        </Box>
      </MenuItem>
    ))
  }

  // Note: minHeight stops a scroll bar from appearing
  let tableElement = (
    <div style={{ minHeight: 100 }}>
      <CircularProgress />
    </div>
  ) as undefined | JSX.Element
  let pages = 1
  if (resultStructures.data) {
    pages = Math.ceil((resultStructures.data.total || pageLimit) / pageLimit)
    if (!resultStructures.isPreviousData) {
      tableElement = <OptimadeTable data={resultStructures.data.structures} />
    }
  } else if (resultStructures.isError) {
    const error = resultStructures.error as { message: string }
    tableElement = <Alert severity="error">{error.message}</Alert>
  }

  return (
    <Grid container alignItems="center">
      <Grid item xs={12}>
        <FormControl className={classes.formControl} fullWidth>
          <InputLabel id="optimade-provider-select-label">Provider</InputLabel>
          <Select
            id="optimade-provider-select"
            value={provider || ''}
            onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
              setProvider(event.target.value as string)
              setPage(1)
            }}
          >
            {items}
          </Select>
        </FormControl>
      </Grid>
      <Grid item sm={8}>
        <TextField
          label="Chemical Formula"
          value={formulaFilter || ''}
          fullWidth
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setformulaFilter(event.target.value)
          }}
          error={formulaFilter ? !formulaPattern.test(formulaFilter) : false}
          helperText={
            formulaFilter && !formulaPattern.test(formulaFilter)
              ? 'Disallowed formula pattern'
              : undefined
          }
          style={{ paddingBottom: 10 }}
        />
      </Grid>
      <Grid item sm={4}>
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              checked={exactFilter}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setexactFilter(event.target.checked)
              }}
            />
          }
          label="Exact match"
          labelPlacement="start"
        />
      </Grid>
      <Grid item xs={12} className={classes.overflowAuto}>
        <Pagination
          disabled={resultStructures.isPreviousData}
          className={classes.pagination}
          color="primary"
          count={pages}
          page={page}
          onChange={(event: React.ChangeEvent<unknown>, value: number) => {
            setPage(value)
          }}
        />
        {tableElement}
      </Grid>
    </Grid>
  )
}

function OptimadeTable({ data }: { data: Types.Structure[] }): JSX.Element {
  return (
    <Table>
      <TableHead>
        <TableRow key="_head">
          <TableCell>ID</TableCell>
          <TableCell>Formula</TableCell>
          <TableCell>Dimensions</TableCell>
          <TableCell>Sites</TableCell>
          <TableCell>Modified</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {(data || []).map(row => (
          <TableRow key={row.id}>
            <TableCell>{row.id}</TableCell>
            <TableCell>{row.attributes?.chemical_formula_descriptive}</TableCell>
            <TableCell>{row.attributes?.dimension_types}</TableCell>
            <TableCell>{row.attributes?.nsites}</TableCell>
            <TableCell>{row.attributes?.last_modified}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
