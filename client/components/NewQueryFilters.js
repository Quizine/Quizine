import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getNewQuery} from '../store/analyticsReducer'
// import {getWaiterFields, getWaiters} from '../store/waiterReducer'

class NewQueryFilters extends Component {
  constructor() {
    super()
    this.state = {
      timeInterval: '',
      selectedColumn: ''
    }
    this.handleSelectedColumnChange = this.handleSelectedColumnChange.bind(this)
    this.handleTimeIntervalChange = this.handleTimeIntervalChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleSubmit(event) {
    event.preventDefault()
    console.log('state ------>', this.state)
    console.log('props -----> ', this.props)
    this.props.getQuery(
      this.props.selectedTable,
      this.state.selectedColumn,
      this.state.timeInterval
    )
  }

  handleSelectedColumnChange(event) {
    this.setState({selectedColumn: event.target.value})
  }

  handleTimeIntervalChange(event) {
    this.setState({timeInterval: event.target.value})
  }

  render() {
    const selectedTable = this.props.selectedTable
    const columnNames = this.props.columnNames

    return (
      <form onSubmit={this.handleSubmit}>
        <select onChange={() => this.handleSelectedColumnChange(event)}>
          <option>Please Select</option>
          {columnNames.map((columnName, idx) => {
            return (
              <option key={idx} value={columnName.column_name}>
                {formatColumnName(columnName.column_name)}
              </option>
            )
          })}
        </select>
        <select onChange={() => this.handleTimeIntervalChange(event)}>
          <option>Please Select</option>
          <option value="year">Year</option>
          <option value="month">Month</option>
          <option value="day">Day</option>
        </select>
        <button type="submit">submit</button>
      </form>
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

const mapDispatchToProps = dispatch => {
  return {
    getQuery: (tableName, columnName, timeInterval) =>
      dispatch(getNewQuery(tableName, columnName, timeInterval))
  }
}

export default connect(null, mapDispatchToProps)(NewQueryFilters)
