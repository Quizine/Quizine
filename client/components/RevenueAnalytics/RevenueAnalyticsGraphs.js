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
import RevenueAnalyticsLineGraph from './RevenueAnalyticsLineGraph'
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
      selectedBarGraphIntervalOption: '30',
      selectedLineGraphIntervalOption: '2',
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
    this.handleBarGraphIntervalChange = this.handleBarGraphIntervalChange.bind(
      this
    )
    this.handleLineGraphIntervalChange = this.handleLineGraphIntervalChange.bind(
      this
    )
    this.handleSelectedQueryChange = this.handleSelectedQueryChange.bind(this)
    this.handleDateChange = this.handleDateChange.bind(this)
  }

  componentDidMount() {
    this.props.loadRevenueQueryResultsInterval(
      this.state.selectedBarGraphIntervalOption,
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
        this.state.startDate.format('YYYY-MM-DD') + 'T04:00:00.000Z'
      const formattedEndDate =
        this.state.endDate.format('YYYY-MM-DD') + 'T23:59:59.000Z'
      this.props.loadRevenueQueryResultsDate(
        formattedStartDate,
        formattedEndDate,
        this.state.selectedQueryTitle
      )
    }
  }

  async handleBarGraphIntervalChange(event) {
    await this.setState({selectedBarGraphIntervalOption: event.target.value})
    if (this.state.selectedBarGraphIntervalOption !== 'custom') {
      this.props.loadRevenueQueryResultsInterval(
        this.state.selectedBarGraphIntervalOption,
        this.state.selectedQueryTitle
      )
    }
  }

  async handleLineGraphIntervalChange(event) {
    await this.setState({selectedLineGraphIntervalOption: event.target.value})
    this.props.loadRevenueQueryResultsInterval(
      this.state.selectedLineGraphIntervalOption,
      this.state.selectedQueryTitle
    )
  }

  async handleSelectedQueryChange(event) {
    await this.setState({
      selectedQueryTitle: event.target.value
    })
    if (this.state.selectedQueryTitle !== 'monthlyRevenueVsLunchVsDinner') {
      if (this.state.selectedBarGraphIntervalOption !== 'custom') {
        this.props.loadRevenueQueryResultsInterval(
          this.state.selectedBarGraphIntervalOption,
          this.state.selectedQueryTitle
        )
      } else if (this.state.startDate && this.state.endDate) {
        const formattedStartDate =
          this.state.startDate.format('YYYY-MM-DD') + 'T04:00:00.000Z'
        const formattedEndDate =
          this.state.endDate.format('YYYY-MM-DD') + 'T23:59:59.000Z'
        this.props.loadRevenueQueryResultsDate(
          formattedStartDate,
          formattedEndDate,
          this.state.selectedQueryTitle
        )
      }
    } else {
      this.props.loadRevenueQueryResultsInterval(
        this.state.selectedLineGraphIntervalOption,
        this.state.selectedQueryTitle
      )
    }
  }

  render() {
    console.log('STATE', this.state)
    console.log('PROPS', this.props.revenueQueryResults)
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
                onChange={this.handleBarGraphIntervalChange}
                className="select-cust"
                defaultValue="30"
              >
                <option value="365">Last 365 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="7">Last 7 Days</option>
                <option value="custom">Custom Dates</option>
              </select>
            </div>
            {this.state.selectedBarGraphIntervalOption === 'custom' ? (
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
                  onFocusChange={focusedInput => this.setState({focusedInput})}
                />
              </Wrapper>
            ) : null}

            <RevenueAnalyticsBarGraphs
              selectedQueryTitle={this.state.selectedQueryTitle}
              revenueQueryResults={this.props.revenueQueryResults}
            />
          </div>
        ) : (
          <div>
            <div className="month-button">
              <select
                onChange={this.handleLineGraphIntervalChange}
                className="select-cust"
                defaultValue="2"
              >
                <option value="1">Last Year</option>
                <option value="2">Last 2 Years</option>
                <option value="allPeriod">All History</option>
              </select>
            </div>
            <RevenueAnalyticsLineGraph
              selectedQueryTitle={this.state.selectedQueryTitle}
              revenueQueryResults={this.props.revenueQueryResults}
            />
          </div>
        )}
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
