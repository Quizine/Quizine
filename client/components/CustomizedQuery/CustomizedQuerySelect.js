import React, {Component} from 'react'
import {connect} from 'react-redux'
import CustomizedQueryWhere from './CustomizedQueryWhere'
import {
  getDataType,
  getValueOptionsForString,
  getTableFields,
  updateColumn
} from '../../store/customizedQueryReducer'

class CustomizedQuerySelect extends Component {
  constructor() {
    super()
    // this.state = {
    //   selectedColumns: []
    // }
    this.handleSelectedColumnChange = this.handleSelectedColumnChange.bind(this)
  }
  componentDidMount() {
    this.props.loadTableFields(this.props.selectedTable)
  }

  async handleSelectedColumnChange(event) {
    // await this.setState({
    //   //USED!!! DO NOT DELETE
    //   selectedColumns: [...this.state.selectedColumns, event.target.value]
    // })
    console.log('IN CLICK!!!! 111', event.target.value)
    await this.props.loadDataType(this.props.selectedTable, event.target.value)
    // console.log('IN CLICK!!!! 222', event.target.value)
    this.props.loadValueOptionsForString(
      this.props.selectedTable,
      event.target.value
    )

    const dataType = extractDataType(
      this.props.selectedTable,
      event.target.value,
      this.props.metaData
    )
    this.props.updateColumn(
      this.props.selectedTable,
      event.target.value,
      dataType
    )
  }

  render() {
    const {customQuery, selectedTable, metaData} = this.props

    console.log('IN SELECT', this.props, this.state)
    console.log('COLUMN ARRAY', columnArrayMapping(selectedTable, customQuery))
    console.log(
      'COLUMN NAME MAPPING 1111',
      selectedTable && metaData && columnNameMapping(selectedTable, metaData)
    )
    console.log(
      'COLUMN NAME MAPPING 2222',
      selectedTable && columnNameMapping(selectedTable, customQuery)
    )
    // const test =
    //   selectedTable &&
    //   metaData &&
    //   columnNameMapping(selectedTable, metaData).filter(
    //     columnNameFilter =>
    //       columnNameMapping(selectedTable, customQuery).indexOf(
    //         columnNameFilter
    //       ) < 0
    //   )

    // const test =
    //   selectedTable &&
    //   metaData &&
    //   columnNameMapping(selectedTable, metaData).filter(
    //     columnNameFilter =>
    //       this.state.selectedColumns.indexOf(columnNameFilter) < 0
    //   )
    return (
      <div>
        {columnArrayMapping(selectedTable, customQuery).map((element, idx) => {
          return (
            <div key={idx}>
              <div>
                <h3>COLUMN:</h3>
                <h3>
                  {Object.keys(element)[0]
                    ? formatColumnName(Object.keys(element)[0])
                    : null}
                </h3>
                <select
                  onChange={() => this.handleSelectedColumnChange(event)}
                  disabled={!!Object.keys(element).length}
                  value={Object.keys(element)[0]}
                >
                  <option value="default">Please Select</option>

                  {selectedTable &&
                    metaData &&
                    columnNameMapping(selectedTable, metaData)
                      .filter(
                        columnNameFilter =>
                          columnNameMapping(selectedTable, customQuery).indexOf(
                            columnNameFilter
                          ) < 0
                      )
                      .map((columnName, idx) => {
                        return (
                          <option key={idx} value={columnName}>
                            {formatColumnName(columnName)}
                          </option>
                        )
                      })}
                </select>
              </div>
              {Object.keys(element)[0] ? (
                <div>
                  <CustomizedQueryWhere
                    selectedTable={selectedTable}
                    selectedColumn={Object.keys(element)[0]}
                  />
                </div>
              ) : null}
            </div>
          )
        })}
      </div>
    )
  }
}

function formatColumnName(name) {
  name = name.replace(/([A-Z])/g, ' $1') // CONVERTS NAMES OF DB COLUMNS INTO READABLE TEXT
  name = name[0].toUpperCase() + name.slice(1)
  return name
}

/**
 * CONTAINER
 */
const mapStateToProps = state => {
  return {
    metaData: state.customizedQuery.metaData,
    valueOptionsForString: state.customizedQuery.valueOptionsForString,
    tableFields: state.customizedQuery.tableFields,
    customQuery: state.customizedQuery.customQuery
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadDataType: (tableName, columnName) =>
      dispatch(getDataType(tableName, columnName)),
    loadValueOptionsForString: (tableName, columnName) =>
      dispatch(getValueOptionsForString(tableName, columnName)),
    loadTableFields: tableName => {
      dispatch(getTableFields(tableName))
    },
    updateColumn: (tableName, columnName, dataType) => {
      dispatch(updateColumn(tableName, columnName, dataType))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  CustomizedQuerySelect
)

function columnNameMapping(tableName, array) {
  return array
    .filter(element => {
      return Object.keys(element)[0] === tableName
    })[0]
    [tableName].map(element => {
      return Object.keys(element)[0]
    })
}

function extractDataType(tableName, columnName, array) {
  return array
    .filter(element => {
      return Object.keys(element)[0] === tableName
    })[0]
    [tableName].filter(element => {
      return Object.keys(element)[0] === columnName
    })[0][columnName].dataType
}

function columnArrayMapping(tableName, array) {
  return array.filter(element => {
    return Object.keys(element)[0] === tableName
  })[0][tableName]
}

// render() {
//   const selectedTable = this.props.selectedTable
//   const columnNames = this.props.columnNames
//   const selectedColumn = this.state.selectedColumn
//   const valueOptionsForString = this.props.valueOptionsForString
//   return (
//     <div>
//       <div>
//         <select onChange={() => this.handleSelectedColumnChange(event)}>
//           <option>Please Select</option>
//           {columnNames.map((columnName, idx) => {
//             return (
//               <option key={idx} value={columnName.column_name}>
//                 {formatColumnName(columnName.column_name)}
//               </option>
//             )
//           })}
//         </select>
//       </div>
//       {selectedColumn ? (
//         <div>
//           <CustomizedQueryWhere
//             selectedTable={selectedTable}
//             selectedColumn={selectedColumn}
//             valueOptionsForString={valueOptionsForString}
//           />
//         </div>
//       ) : null}
//     </div>
//   )
// }
// }
