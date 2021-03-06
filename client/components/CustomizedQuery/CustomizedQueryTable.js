/* eslint-disable complexity */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {
  getTableFields,
  updateTable,
  getTableNames,
  clearCustomQuery,
  addEmptyColumn,
  gotCustomQueryResult,
  addEmptyTable,
  getJoinTables
} from '../../store/customizedQueryReducer'
import CustomizedQuerySelect from './CustomizedQuerySelect'
import _ from 'lodash'

export class CustomizedQueryTable extends Component {
  constructor() {
    super()
    this.state = {
      disabled: false, //USED!!! DO NOT DELETE
      defaultValue: 'default' //USED!!! DO NOT DELETE
    }
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    this.props.loadTableNames()
  }

  handleChange(event) {
    this.props.loadTableFields(event.target.value)

    this.props.updateTable(event.target.value)
    this.props.addEmptyColumn(event.target.value)

    this.props.getJoinTables(event.target.value)

    this.setState({
      //USED!!! DO NOT DELETE
      disabled: true,
      defaultValue: event.target.value
    })
    event.target.disabled = true
  }

  render() {
    const {tableNames, customQuery, joinTables, selectedTable} = this.props

    const penultimateSelectedTable =
      customQuery.length > 1
        ? Object.keys(customQuery[customQuery.length - 2])[0]
        : null

    const tableNamesToRender = penultimateSelectedTable
      ? joinTables
      : tableNames

    return (
      <div className="custom-analytics-container">
        <div className="row-query">
          <div className="select-table-name">
            <h3>
              {this.state.defaultValue === 'default'
                ? 'Select Category:'
                : 'Selected Category:'}
            </h3>
            {this.state.defaultValue === 'default' ? (
              <select
                onChange={() => this.handleChange(event)}
                disabled={this.state.disabled}
                value={this.state.defaultValue}
                className="select-cust"
              >
                <option value="default">Please Select</option>

                {tableNamesToRender.map((element, idx) => {
                  return (
                    <option value={element} key={idx}>
                      {formatName(element)}
                    </option>
                  )
                })}
              </select>
            ) : (
              <h2>{formatName(this.state.defaultValue)}</h2>
            )}
          </div>

          <div className="where-top-cont">
            {customQuery.length ? (
              <div className="row-columns">
                {this.props.selectedTable ? (
                  <CustomizedQuerySelect selectedTable={selectedTable} />
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    metaData: state.customizedQuery.metaData,
    tableNames: state.customizedQuery.metaData.map(element => {
      return Object.keys(element)[0]
    }),
    tableFields: state.customizedQuery.tableFields,
    customQuery: state.customizedQuery.customQuery,
    joinTables: state.customizedQuery.joinTables
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadTableNames: () => {
      dispatch(getTableNames())
    },
    loadTableFields: tableName => {
      dispatch(getTableFields(tableName))
    },
    updateTable: queryObject => {
      dispatch(updateTable(queryObject))
    },
    clearCustomQuery: () => {
      dispatch(clearCustomQuery())
    },
    clearQueryResults: () => {
      dispatch(gotCustomQueryResult([]))
    },
    addEmptyColumn: tableName => {
      dispatch(addEmptyColumn(tableName))
    },
    addEmptyTable: () => {
      dispatch(addEmptyTable())
    },
    getJoinTables: selectedTable => {
      dispatch(getJoinTables(selectedTable))
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(
  CustomizedQueryTable
)

//Helper functions
function formatName(name) {
  name = name.replace(/([A-Z])/g, ' $1') // CONVERTS NAMES OF DB COLUMNS INTO READABLE TEXT
  name = name[0].toUpperCase() + name.slice(1)
  return name
}
