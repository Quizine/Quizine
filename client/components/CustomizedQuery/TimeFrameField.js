import React, {Component} from 'react'

const timeFrameOptions = [
  {week: 'Last Week'},
  {month: 'Last Month'},
  {year: 'Last Year'}
]

export class TimeFrameField extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedInterval: ''
    }
  }

  handleChange(event) {
    this.setState({selectedInterval: event.target.value})
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

export default TimeFrameField
