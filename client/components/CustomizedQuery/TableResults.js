import React, {Component} from 'react'
import {connect} from 'react-redux'
import {CSVLink} from 'react-csv'
import _ from 'lodash'

// receives rows and fields
const exampleData = {
  rows: [
    {
      menuName: 'lobster',
      mealType: 'lunch',
      menuNam: 'lo222bster',
      mealTy2pe: 'lun222ch'
    },
    {menuName: 'pizza', mealType: 'dinner', sdd: '233', deed: 'cdsklclscn'},
    {
      menuName: 'lobster',
      mealType: 'lunch',
      menuNam: 'lo222bster',
      mealTy2pe: 'lun222ch'
    },
    {menuName: 'pizza', mealType: 'dinner', sdd: '233', deed: 'cdsklclscn'},
    {
      menuName: 'lobster',
      mealType: 'lunch',
      menuNam: 'lo222bster',
      mealTy2pe: 'lun222ch'
    }
  ],
  fields: [
    {
      name: 'menuName',
      tableID: 185347,
      columnID: 2,
      dataTypeID: 1043,
      dataTypeSize: -1,
      dataTypeModifier: 259,
      format: 'text'
    },
    {
      name: 'mealType',
      tableID: 185347,
      columnID: 5,
      dataTypeID: 185340,
      dataTypeSize: 4,
      dataTypeModifier: -1,
      format: 'text'
    },
    {
      name: 'Bla',
      tableID: 185347,
      columnID: 5,
      dataTypeID: 185340,
      dataTypeSize: 4,
      dataTypeModifier: -1,
      format: 'text'
    },
    {
      name: 'Fulls',
      tableID: 185347,
      columnID: 5,
      dataTypeID: 185340,
      dataTypeSize: 4,
      dataTypeModifier: -1,
      format: 'text'
    }
  ]
}

export class TableResults extends Component {
  render() {
    const tableData = this.props.queryResult || {fields: [], rows: []}
    console.log(`here is tableData:`, tableData.fields)
    const [rows, columns] = modifyEndpoint(exampleData)
    const dataForCsv = [columns, ...rows]
    return (
      <div className="table-results-cont">
        <div className="table-wrapper">
          <table className="fl-table">
            <thead>
              <tr>
                {columns.map((col, idx) => {
                  return <th key={idx}>{col}</th>
                })}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => {
                return (
                  <tr key={idx}>
                    {row.map((item, innerIdx) => {
                      return <td key={innerIdx}>{item}</td>
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <button type="button" className="download-btn">
          <CSVLink data={dataForCsv}>Download CSV</CSVLink>
        </button>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    queryResult: state.customizedQuery.customQueryResult
  }
}

export default connect(mapStateToProps)(TableResults)

function modifyEndpoint(obj) {
  const columns = obj.fields.map(column => _.startCase(column.name))
  const rows = obj.rows.map(row => Object.values(row))
  return [rows, columns]
}
