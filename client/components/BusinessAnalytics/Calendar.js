import React, {Component} from 'react'
import Calendar from 'react-calendar/dist/entry.nostyle'
import CalendarStats from './CalenderStats'

export class CalendarContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      date: new Date(2020, 0, 29, 0, 0, 0, 0)
    }
  }

  onChange = date => this.setState({date})

  render() {
    console.log(convertJsDate(this.state.date))
    return (
      <div className="calendar-container">
        <div>
          <Calendar
            className="reactCalendar"
            onChange={this.onChange}
            value={this.state.date}
          />
        </div>
        <div>
          <CalendarStats />
        </div>
      </div>
    )
  }
}

export default CalendarContainer

function convertJsDate(date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}
