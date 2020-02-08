import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getNewQuery} from '../../store/customizedQueryReducer'

class CustomizedQuerySelect extends Component {
  constructor() {
    super()
    this.state = {
      timeInterval: '',
      selectedColumn: ''
    }
    this.handleSelectedColumnChange = this.handleSelectedColumnChange.bind(this)
    // this.handleTimeIntervalChange = this.handleTimeIntervalChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleSubmit(event) {
    event.preventDefault()
    this.props.getQuery(this.state.selectedColumn)
  }

  handleSelectedColumnChange(event) {
    this.props.value = event.target.value
  }

  render() {
    const columnNames = this.props.columnNames
    return (
      <form onSubmit={() => this.handleSubmit(event)}>
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

        {/* <button type="submit">submit</button> */}
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
  return {}
}

export default connect(null, mapDispatchToProps)(CustomizedQuerySelect)

// handleTimeIntervalChange(event) {
//   this.setState({timeInterval: event.target.value})
// }

/* <select onChange={() => this.handleTimeIntervalChange(event)}>
  <option>Please Select</option>
  <option value="year">Year</option>
  <option value="month">Month</option>
  <option value="day">Day</option>
</select> */
