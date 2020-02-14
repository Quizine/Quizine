import React, {Component} from 'react'
import {connect} from 'react-redux'
import CustomizedQueryWhere from './CustomizedQueryWhere'
import {
  getDataType,
  getValueOptionsForString,
  getTableFields,
  updateColumn,
  addGroupBy
} from '../../store/customizedQueryReducer'

const funcTypeOperators = [
  {Total: 'sum'}, // Questionable
  {Average: 'avg'},
  {Minimum: 'min'},
  {Maximum: 'max'},
  {Count: 'count'}
]

class CustomizedQuerySelect extends Component {
  constructor() {
    super()
    this.state = {
      checked: false,
      selectedColumnInUse: '',
      funcOperator: ''
    }
    this.handleSelectedColumnChange = this.handleSelectedColumnChange.bind(this)
    this.handleFuncSelect = this.handleFuncSelect.bind(this)
  }
  componentDidMount() {
    this.props.loadTableFields(this.props.selectedTable)
  }

  async handleFuncSelect(event) {
    await this.setState({funcOperator: event.target.value})
    const dataType = extractDataType(
      this.props.selectedTable,
      this.state.selectedColumnInUse,
      this.props.metaData
    )
    this.props.updateColumn(
      this.props.selectedTable,
      this.state.selectedColumnInUse,
      dataType,
      this.state.funcOperator
    )
  }

  async handleSelectedColumnChange(event) {
    // await this.setState({
    //   //USED!!! DO NOT DELETE
    //   selectedColumns: [...this.state.selectedColumns, event.target.value]
    // })

    await this.setState({
      selectedColumnInUse: event.target.value
    })
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

  async handleChecked(event) {
    await this.setState(state => {
      return {checked: !state.checked}
    })
    if (this.state.checked) {
      this.props.updateGroupBy(this.state.selectedColumnInUse)
    }
  }

  render() {
    const {customQuery, selectedTable, metaData} = this.props

    // console.log('IN SELECT', this.props, this.state)
    // console.log('COLUMN ARRAY', columnArrayMapping(selectedTable, customQuery))
    // console.log(
    //   'COLUMN NAME MAPPING 1111',
    //   selectedTable && metaData && columnNameMapping(selectedTable, metaData)
    // )
    // console.log(
    //   'COLUMN NAME MAPPING 2222',
    //   selectedTable && columnNameMapping(selectedTable, customQuery)
    // )
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
      <div className="select-where-cont">
        {columnArrayMapping(selectedTable, customQuery) &&
          columnArrayMapping(selectedTable, customQuery).map((element, idx) => {
            return (
              <div key={idx} className="select-where">
                <div className="col-cont">
                  <h3>Select Search Criteria:</h3>
                  {/* <h3>
                  {Object.keys(element)[0]
                    ? formatColumnName(Object.keys(element)[0])
                    : null}
                </h3> */}
                  <select
                    className="select-cust"
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
                            columnNameMapping(
                              selectedTable,
                              customQuery
                            ).indexOf(columnNameFilter) < 0
                        )
                        .map((columnName, idx) => {
                          return (
                            <option key={idx} value={columnName}>
                              {formatColumnName(columnName)}
                            </option>
                          )
                        })}
                  </select>
                  <select
                    className="select-cust"
                    onChange={() => this.handleFuncSelect(event)}
                  >
                    <option value="default">Please Select</option>
                    {funcTypeOperators.map((option, idx) => {
                      return (
                        <option key={idx} value={Object.values(option)[0]}>
                          {Object.keys(option)[0]}
                        </option>
                      )
                    })}
                  </select>
                </div>
                <div className="where-cont">
                  {Object.keys(element)[0] ? (
                    <div>
                      <CustomizedQueryWhere
                        selectedTable={selectedTable}
                        selectedColumn={Object.keys(element)[0]}
                      />
                    </div>
                  ) : null}
                </div>
                <div>
                  <input
                    type="checkbox"
                    checked={this.state.checked}
                    id="groupBy"
                    name="groupBy"
                    onChange={() => this.handleChecked(event)}
                  />
                  <label htmlFor="groupBy">Group By</label>
                </div>
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
    updateColumn: (tableName, columnName, dataType, funcType) => {
      dispatch(updateColumn(tableName, columnName, dataType, funcType))
    },
    updateGroupBy: selectedColumn => {
      dispatch(addGroupBy(selectedColumn))
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
