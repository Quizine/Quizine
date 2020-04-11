import 'react-dates/initialize'
import 'react-dates/lib/css/_datepicker.css'
import styled from 'styled-components'
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {
  getRevenueQueryResultsDate,
  getRevenueQueryResultsInterval
} from '../../store/revenueAnalyticsReducer'
import RevenueAnalyticsBarGraphs from './RevenueAnalyticsBarGraphs'
import {DateRangePicker} from 'react-dates'
import moment from 'moment'

//WRAPPER FOR OVERRIDING STYLES FOR DATERANGEPICKER COMPONENT
const Wrapper = styled.div`
  .DateInput_input {
    width: 80%;
    font-family: 'Exo', sans-serif;
    color: hsl(0, 0%, 50%);
    font-weight: 400;
    font-size: 16px;
    padding: 5.5px 10px 5.5px 10px;
    text-align: center;
  }
  .DateRangePickerInput__withBorder {
    border-radius: 4px;
    border-color: hsl(0, 0%, 80%);
  }
  .DateRangePickerInput_calendarIcon {
    padding: 5.5px 10px 11px 10px;
  }
  .DateRangePickerInput_clearDates_svg {
    fill: #82888a;
    height: 12px;
    width: 15px;
    vertical-align: middle;
    cursor: default;
  }
`

class RevenueAnalyticsGraphs extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedOption: '30',
      queryTitleOptions: [
        'avgRevenuePerGuestVsDOW',
        'numberOfOrdersVsHour',
        'monthlyRevenueVsLunchVsDinner'
      ],
      selectedQueryTitle: 'avgRevenuePerGuestVsDOW',
      startDate: null,
      endDate: null,
      focusedInput: null
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSelectedQueryChange = this.handleSelectedQueryChange.bind(this)
  }

  componentDidMount() {
    this.props.loadRevenueQueryResultsInterval(
      this.state.selectedOption,
      this.state.selectedQueryTitle
    )
  }

  async handleDateChange({startDate, endDate}) {
    await this.setState({
      startDate,
      endDate
    })
    if (this.state.startDate && this.state.endDate) {
      const formattedStartDate =
        this.state.startDate.format('YYYY-MM-DD') + ' 00:00:00'
      const formattedEndDate =
        this.state.endDate.format('YYYY-MM-DD') + ' 23:59:59'
      this.props.loadRevenueQueryResultsDate(
        formattedStartDate,
        formattedEndDate,
        this.state.selectedQueryTitle
      )
    }
  }

  async handleChange(event) {
    await this.setState({selectedOption: event.target.value})
    if (this.state.selectedOption !== 'custom') {
      this.props.loadRevenueQueryResultsInterval(
        this.state.selectedOption,
        this.state.selectedQueryTitle
      )
    }
  }

  async handleSelectedQueryChange(event) {
    await this.setState({
      selectedQueryTitle: event.target.value
    })
    if (this.state.selectedOption !== 'custom') {
      this.props.loadRevenueQueryResultsInterval(
        this.state.selectedOption,
        this.state.selectedQueryTitle
      )
    } else if (this.state.startDate && this.state.endDate) {
      const formattedStartDate =
        this.state.startDate.format('YYYY-MM-DD') + ' 00:00:00'
      const formattedEndDate =
        this.state.endDate.format('YYYY-MM-DD') + ' 23:59:59'
      this.props.loadRevenueQueryResultsDate(
        formattedStartDate,
        formattedEndDate,
        this.state.selectedQueryTitle
      )
    }
  }

  render() {
    console.log('STATE', this.state)
    return (
      <div>
        <div>
          <select
            className="select-cust"
            onChange={this.handleSelectedQueryChange}
          >
            {this.state.queryTitleOptions.map((query, idx) => {
              return (
                <option key={idx} value={query}>
                  {formatQueryName(query)}
                </option>
              )
            })}
          </select>
        </div>
        {this.state.selectedQueryTitle !== 'monthlyRevenueVsLunchVsDinner' ? (
          <div>
            <div className="month-button">
              <select
                onChange={this.handleChange}
                className="select-cust"
                defaultValue="30"
              >
                <option value="365">Last 365 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="7">Last 7 Days</option>
                <option value="custom">Custom Dates</option>
              </select>
              {this.state.selectedOption === 'custom' ? (
                <Wrapper>
                  <DateRangePicker
                    showDefaultInputIcon={true}
                    showClearDates={true}
                    isOutsideRange={day =>
                      day.isAfter(moment()) ||
                      day.isBefore(moment().subtract(365 * 2, 'days'))
                    }
                    reopenPickerOnClearDates={true}
                    startDate={this.state.startDate}
                    endDate={this.state.endDate}
                    onDatesChange={({startDate, endDate}) =>
                      this.handleDateChange({startDate, endDate})
                    }
                    focusedInput={this.state.focusedInput}
                    onFocusChange={focusedInput =>
                      this.setState({focusedInput})
                    }
                  />
                </Wrapper>
              ) : null}
            </div>
            <RevenueAnalyticsBarGraphs
              selectedQueryTitle={this.state.selectedQueryTitle}
              revenueQueryResults={this.props.revenueQueryResults}
            />
          </div>
        ) : null}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    revenueQueryResults: state.revenueAnalytics.revenueQueryResults
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadRevenueQueryResultsInterval: (timeInterval, queryTitle) =>
      dispatch(getRevenueQueryResultsInterval(timeInterval, queryTitle)),
    loadRevenueQueryResultsDate: (startDate, endDate, queryTitle) =>
      dispatch(getRevenueQueryResultsDate(startDate, endDate, queryTitle))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  RevenueAnalyticsGraphs
)

function formatQueryName(name) {
  name = name.replace(/([A-Z])/g, ' $1')
  name = name[0].toUpperCase() + name.slice(1)
  return name
}
