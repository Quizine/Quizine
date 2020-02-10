import React, {Component} from 'react'
import {connect} from 'react-redux'
import CustomizedQueryWhere from './CustomizedQueryWhere'
import {
  getDataType,
  getValueOptionsForString,
  getTableFields,
  updateCustomQuery
} from '../../store/customizedQueryReducer'

class CustomizedQuerySelect extends Component {
  constructor() {
    super()
    this.state = {
      selectedColumn: ''
      // columnNamesObject: {}
    }
    this.handleSelectedColumnChange = this.handleSelectedColumnChange.bind(this)
  }
  componentDidMount() {
    console.log('**********************IN CDM')
    this.props.loadTableFields(this.props.selectedTable)
  }

  handleSelectedColumnChange(event) {
    this.setState({selectedColumn: event.target.value})
    this.props.loadDataType(this.props.selectedTable, event.target.value)

    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!ADD TO CODE ONCE HELPER FUNCTION IN REDUVER IS FIXED
    // this.props.updateCustomQuery({
    //   tableName: this.props.selectedTable,
    //   columnName: event.target.value
    // })
  }

  render() {
    console.log('STATE', this.state)
    console.log('PROPS', this.props)
    const selectedTable = this.props.selectedTable
    const columnNames = this.props.tableFields
    const metaData = this.props.metaData
    console.log('FUNC', columnNameMapping(selectedTable, metaData))
    const selectedColumn = this.state.selectedColumn // TO BE UPDATED TO REDUCER ONCE HELPER FUNC IS FIXED
    const valueOptionsForString = this.props.valueOptionsForString
    return (
      <div>
        <div>
          <h3>COLUMN:</h3>
          <select onChange={() => this.handleSelectedColumnChange(event)}>
            {/* <select> */}
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
        {selectedColumn ? (
          <div>
            <CustomizedQueryWhere
              selectedTable={selectedTable}
              selectedColumn={selectedColumn}
              // valueOptionsForString={valueOptionsForString}
            />
          </div>
        ) : null}
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
    // dataType: state.customizedQuery.dataType,
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
    updateCustomQuery: queryObject => {
      dispatch(updateCustomQuery(queryObject))
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
