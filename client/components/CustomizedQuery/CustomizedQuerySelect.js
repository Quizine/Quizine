import React, {Component} from 'react'
import {connect} from 'react-redux'
import CustomizedQueryWhere from './CustomizedQueryWhere'
import {
  getDataType,
  getValueOptionsForString
} from '../../store/customizedQueryReducer'

class CustomizedQuerySelect extends Component {
  constructor() {
    super()
    this.state = {
      selectedColumn: ''
    }
    this.handleSelectedColumnChange = this.handleSelectedColumnChange.bind(this)
  }

  async handleSelectedColumnChange(event) {
    this.setState({selectedColumn: event.target.value})
    await this.props.loadDataType(this.props.selectedTable, event.target.value)
    if (
      this.props.dataType !== 'timestamp with time zone' &&
      this.props.dataType !== 'integer'
    ) {
      await this.props.loadValueOptionsForString(
        this.props.selectedTable,
        event.target.value
      )
    }
  }

  render() {
    console.log('STATE', this.state)
    console.log('PROPS', this.props)
    const selectedTable = this.props.selectedTable
    const columnNames = this.props.columnNames
    const selectedColumn = this.state.selectedColumn
    const valueOptionsForString = this.props.valueOptionsForString
    return (
      <div>
        <div>
          <h3>COLUMN:</h3>
          <select onChange={() => this.handleSelectedColumnChange(event)}>
            {/* <select> */}
            <option>Please Select</option>
            {columnNames.map((columnName, idx) => {
              return (
                <option key={idx} value={columnName.column_name}>
                  {formatColumnName(columnName.column_name)}
                </option>
              )
            })}
          </select>
        </div>
        {selectedColumn ? (
          <div>
            <CustomizedQueryWhere
              selectedTable={selectedTable}
              selectedColumn={selectedColumn}
              valueOptionsForString={valueOptionsForString}
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
    dataType: state.customizedQuery.dataType,
    valueOptionsForString: state.customizedQuery.valueOptionsForString
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadDataType: (tableName, columnName) =>
      dispatch(getDataType(tableName, columnName)),
    loadValueOptionsForString: (tableName, columnName) =>
      dispatch(getValueOptionsForString(tableName, columnName))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  CustomizedQuerySelect
)

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
