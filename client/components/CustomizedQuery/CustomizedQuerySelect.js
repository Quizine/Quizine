import React, {Component} from 'react'
import {connect} from 'react-redux'
import CustomizedQueryWhere from './CustomizedQueryWhere'
import _ from 'lodash'
import {
  getDataType,
  getValueOptionsForString,
  getTableFields,
  updateColumn
} from '../../store/customizedQueryReducer'
import CustomizedQueryFunc from './CustomizedQueryFunc'

class CustomizedQuerySelect extends Component {
  constructor() {
    super()
    this.state = {
      selectedColumnInUse: '',
      funcOperator: '',
      selectedDataType: ''
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
    await this.setState({
      selectedColumnInUse: event.target.value
    })
    await this.props.loadDataType(this.props.selectedTable, event.target.value)

    this.props.loadValueOptionsForString(
      this.props.selectedTable,
      event.target.value
    )

    const dataType = await extractDataType(
      this.props.selectedTable,
      event.target.value,
      this.props.metaData
    )
    await this.setState({
      selectedDataType: dataType
    })
    this.props.updateColumn(
      this.props.selectedTable,
      event.target.value,
      dataType
    )
  }

  render() {
    const {customQuery, selectedTable, metaData} = this.props

    return (
      <div className="select-where-cont">
        {columnArrayMapping(selectedTable, customQuery) &&
          // eslint-disable-next-line complexity
          columnArrayMapping(selectedTable, customQuery).map((element, idx) => {
            return (
              <div key={idx} className="select-where">
                <div className="col-cont">
                  <h3>
                    {checkIfColumnSelected(element)
                      ? 'Select Search Criteria:'
                      : 'Selected Criteria:'}
                  </h3>

                  {checkIfColumnSelected(element) ? (
                    <div>
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
                    </div>
                  ) : (
                    <h1>{formatColumnName(Object.keys(element)[0])}</h1>
                  )}
                  {selectedTable &&
                  Object.keys(element)[0] &&
                  this.state.selectedDataType === 'integer' ? (
                    <div>
                      <CustomizedQueryFunc
                        selectedTable={selectedTable}
                        selectedColumn={Object.keys(element)[0]}
                      />
                    </div>
                  ) : null}
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
              </div>
            )
          })}
      </div>
    )
  }
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

function checkIfColumnSelected(element) {
  return _.isEmpty(Object.keys(element)[0])
}

function formatColumnName(name) {
  name = name.replace(/([A-Z])/g, ' $1') // CONVERTS NAMES OF DB COLUMNS INTO READABLE TEXT
  name = name[0].toUpperCase() + name.slice(1)
  return name
}
