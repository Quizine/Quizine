import React, {Component} from 'react'
import Calendar from 'react-calendar/dist/entry.nostyle'
import {getCalendarData} from '../../../store/summaryReducer'
import {connect} from 'react-redux'
import CalendarStats from './CalendarStats'

export class CalendarContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      date: new Date(2020, 0, 29, 0, 0, 0, 0)
    }
  }
  componentDidMount() {
    this.props.loadCalendarData(convertJsDate(this.state.date))
  }

  onChange = async date => {
    await this.setState({date})
    this.props.loadCalendarData(convertJsDate(this.state.date))
  }

  render() {
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

const mapDispatchToProps = dispatch => {
  return {
    loadCalendarData: date => dispatch(getCalendarData(date))
  }
}

export default connect(null, mapDispatchToProps)(CalendarContainer)

function convertJsDate(date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}
