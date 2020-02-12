import React, {Component} from 'react'
import {connect} from 'react-redux'
import {CSVLink} from 'react-csv'
import _ from 'lodash'

export class TableResults extends Component {
  render() {
    const tableData = this.props.results
    console.log(`here is tableData:`, tableData.fields)
    const [rows, columns] = modifyEndpoint(tableData)
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
