import React, {Component} from 'react'
import {connect} from 'react-redux'
// import {getWaiterFields, getWaiters} from '../store/waiterReducer'

export class NewQueryFilters extends Component {
  constructor() {
    super()
    this.state = {
      timeInterval: '',
      selectedColumn: ''
    }
    this.handleSelectedColumnChange = this.handleSelectedColumnChange.bind(this)
    this.handleTimeIntervalChange = this.handleTimeIntervalChange.bind(this)
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
      <div>
        <select onChange={() => this.handleSelectedColumnChange(event)}>
          {columnNames.map((columnName, idx) => {
            return <option key={idx}>{columnName}</option>
          })}
        </select>
        <select onChange={() => this.handleTimeIntervalChange(event)}>
          <option value="year">Year</option>
          <option value="month">Month</option>
          <option value="day">Day</option>
        </select>
      </div>
    )
  }
}

// /**
//  * CONTAINER
//  */
// const mapState = state => {
//   return {
//     rows: state.waiters.rows,
//     fields: state.waiters.fields
//   }
// }

// const mapDispatchToProps = dispatch => {
//   return {
//     getWaiterFields: () => dispatch(getWaiterFields()),
//     getWaiters: () => dispatch(getWaiters())
//   }
// }

export default connect(mapState, mapDispatchToProps)(NewQueryFilters)
