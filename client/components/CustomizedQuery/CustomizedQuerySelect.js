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
    this.state = {
      // selectedColumn: ''
      // columnNamesObject: {}
    }
    this.handleSelectedColumnChange = this.handleSelectedColumnChange.bind(this)
  }
  componentDidMount() {
    this.props.loadTableFields(this.props.selectedTable)
  }

  async handleSelectedColumnChange(event) {
    // this.setState({selectedColumn: event.target.value})
    await this.props.loadDataType(this.props.selectedTable, event.target.value)
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
    const selectedTable = this.props.selectedTable
    const metaData = this.props.metaData
    const {customQuery} = this.props

    console.log('COLUMN ARRAY', columnArrayMapping(selectedTable, customQuery))
    return (
      <div>
        {columnArrayMapping(selectedTable, customQuery).map((element, idx) => {
          return (
            <div key={idx}>
              <div>
                <h3>COLUMN:</h3>
                <select onChange={() => this.handleSelectedColumnChange(event)}>
                  <option>Please Select</option>
                  {selectedTable &&
                    metaData &&
                    columnNameMapping(selectedTable, metaData).map(
                      (columnName, idx) => {
                        return (
                          <option key={idx} value={columnName}>
                            {formatColumnName(columnName)}
                          </option>
                        )
                      }
                    )}
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
