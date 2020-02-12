import React, {Component} from 'react'
import {connect} from 'react-redux'
import {updateOption} from '../../store/customizedQueryReducer'

const timeFrameOptions = [
  {week: 'Last Week'},
  {month: 'Last Month'},
  {year: 'Last Year'}
]

class TimeFrameField extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedInterval: ['']
    }
  }

  async handleChange(event) {
    await this.setState({selectedInterval: [event.target.value]})
    console.log('TIMEFRAME----->', this.state.selectedInterval)
    this.props.updateOptionForCustomQuery(
      this.props.selectedTable,
      this.props.selectedColumn,
      this.state.selectedInterval
    )
  }

  render() {
    return (
      <div>
        <h3>TimeStamp WHERE</h3>
        <select onChange={() => this.handleChange(event)}>
          <option>Please Select Period</option>
          {timeFrameOptions.map((option, idx) => {
            return (
              <option key={idx} value={Object.keys(option)[0]}>
                {Object.values(option)[0]}
              </option>
            )
          })}
        </select>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateOptionForCustomQuery: (tableName, columnName, options) =>
      dispatch(updateOption(tableName, columnName, options))
  }
}

export default connect(null, mapDispatchToProps)(TimeFrameField)
