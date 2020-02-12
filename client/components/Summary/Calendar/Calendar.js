import React, {Component} from 'react'
import Calendar from 'react-calendar/dist/entry.nostyle'
import {getCalendarData} from '../../../store/summaryReducer'
import {connect} from 'react-redux'
import CalendarStats from './CalendarStats'

export class CalendarContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      date: new Date()
    }
    this.onChange = this.onChange.bind(this)
  }
  componentDidMount() {
    this.props.loadCalendarData(convertJsDate(this.state.date))
  }

  async onChange(date) {
    await this.setState({date})
    this.props.loadCalendarData(convertJsDate(this.state.date))
  }

  render() {
    return (
      <div className="calendar-container">
        <div className="calendar-itself">
          <Calendar
            className="reactCalendar"
            onChange={this.onChange}
            value={this.state.date}
            minDate={new Date(2018, 0, 1)}
            maxDate={new Date()}
          />
        </div>
        <div>
          <CalendarStats currentDate={this.state.date} />
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
