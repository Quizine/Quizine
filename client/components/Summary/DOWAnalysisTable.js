import React from 'react'
import PropTypes from 'prop-types'
import {makeStyles} from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
})

const numberFormatter = new Intl.NumberFormat('en-US')

const hashOfDOW = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6
}

function desc(a, b, orderBy) {
  if (orderBy === 'dayOfWeek') {
    if (hashOfDOW[b[orderBy]] < hashOfDOW[a[orderBy]]) {
      return -1
    }
    if (hashOfDOW[b[orderBy]] > hashOfDOW[a[orderBy]]) {
      return 1
    }
  } else {
    if (b[orderBy] < a[orderBy]) {
      return -1
    }
    if (b[orderBy] > a[orderBy]) {
      return 1
    }
  }

  return 0
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })
  return stabilizedThis.map(el => el[0])
}

function getSorting(order, orderBy) {
  return order === 'desc'
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy)
}

const headCells = [
  {
    id: 'dayOfWeek',
    label: 'Day of the Week'
  },
  {
    id: 'numberOfGuests',
    label: 'Guests (ppl)'
  },
  {
    id: 'dayRevenue',
    label: 'Revenue'
  },
  {
    id: 'menuItemsSold',
    label: 'Menu Items Sold (qty)'
  }
]

function EnhancedTableHead(props) {
  const {classes, order, orderBy, onRequestSort} = props
  const createSortHandler = property => event => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox" />
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align="center"
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired
}

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%'
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2)
  },
  table: {
    minWidth: 750
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1
  }
}))

export default function EnhancedTable(props) {
  const rows = props.DOWAnalysisTable
  const classes = useStyles()
  const [order, setOrder] = React.useState('asc')
  const [orderBy, setOrderBy] = React.useState('dayOfWeek')

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableContainer>
          <Typography className={classes.title} variant="h6" id="tableTitle">
            Summary Analysis by Day of Week For the Last Year
          </Typography>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size="small"
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {stableSort(rows, getSorting(order, orderBy)).map(
                (row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`

                  return (
                    <TableRow hover tabIndex={-1} key={row.dayOfWeek}>
                      <TableCell padding="checkbox" />
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                        align="center"
                      >
                        {row.dayOfWeek}
                      </TableCell>
                      <TableCell align="center">
                        {numberFormatter.format(row.numberOfGuests)}
                      </TableCell>
                      <TableCell align="center">
                        {currencyFormatter.format(row.dayRevenue)}
                      </TableCell>
                      <TableCell align="center">
                        {numberFormatter.format(row.menuItemsSold)}
                      </TableCell>
                    </TableRow>
                  )
                }
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  )
}
