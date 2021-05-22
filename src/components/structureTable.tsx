import { DataGrid, GridColDef, GridCellParams } from '@material-ui/data-grid'
import { useTheme } from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'

import { IStructureData, element2colorCss, kinds2elMap } from './structureUtils'

/** Create a table of the atoms */
export function StructureTable({
  data
}: {
  data: IStructureData
}): JSX.Element {
  const theme = useTheme()
  const kindMap = kinds2elMap(data.attributes.kinds)
  const columns: GridColDef[] = [
    {
      field: 'element',
      headerName: 'Element',
      width: 140,
      renderCell: (params: GridCellParams) => {
        const color = element2colorCss(`${params.value}`)
        return (
          <Avatar
            style={{
              backgroundColor: color,
              color: theme.palette.getContrastText(color)
            }}
          >
            {params.value}
          </Avatar>
        )
      }
    },
    { field: 'kind', headerName: 'Kind', width: 120 },
    { field: 'x', headerName: 'X', type: 'number' },
    { field: 'y', headerName: 'Y', type: 'number' },
    { field: 'z', headerName: 'Z', type: 'number' }
  ]
  const rows = data.attributes.sites.map((site, index) => {
    return {
      id: index,
      element: kindMap[site.kind_name],
      kind: site.kind_name,
      x: site.position[0],
      y: site.position[0],
      z: site.position[0]
    }
  })
  return (
    <div style={{ width: '100%' }} className="structure-table">
      <DataGrid autoHeight rows={rows} columns={columns} />
    </div>
  )
}
