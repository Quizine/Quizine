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
import XAxisOptions from './XAxisOptions'
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
      selectedXAxisOption: 'day',
      queryTitleOptions: [
        'avgRevenuePerGuest',
        'numberOfOrders',
        'lunchAndDinnerRevenueComparison'
      ],
      selectedQueryTitle: 'avgRevenuePerGuest',
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
    this.handleXAxisOptionChange = this.handleXAxisOptionChange.bind(this)
  }

  componentDidMount() {
    this.props.loadRevenueQueryResultsInterval(
      this.state.selectedBarGraphIntervalOption,
      this.state.selectedQueryTitle,
      this.state.selectedXAxisOption
    )
  }

  async handleDateChange({startDate, endDate}) {
    await this.setState({
      startDate,
      endDate,
      selectedXAxisOption: 'day'
    })
    if (this.state.startDate && this.state.endDate) {
      const formattedStartDate =
        this.state.startDate.clone().format('YYYY-MM-DD') + ' 00:00:00'
      const formattedEndDate =
        this.state.endDate.clone().format('YYYY-MM-DD') + ' 23:59:59'
      this.props.loadRevenueQueryResultsDate(
        formattedStartDate,
        formattedEndDate,
        this.state.selectedQueryTitle,
        this.state.selectedXAxisOption
      )
    }
  }

  // eslint-disable-next-line complexity
  async handleBarGraphIntervalChange(event) {
    await this.setState({selectedBarGraphIntervalOption: event.target.value})
    if (
      this.state.selectedBarGraphIntervalOption === 'allPeriod' ||
      +this.state.selectedBarGraphIntervalOption > 365
    ) {
      if (this.state.selectedXAxisOption === 'hour') {
        await this.setState({selectedXAxisOption: 'day'})
      }
    } else if (+this.state.selectedBarGraphIntervalOption === 365) {
      if (this.state.selectedXAxisOption === 'year') {
        await this.setState({selectedXAxisOption: 'month'})
      }
    } else if (
      +this.state.selectedBarGraphIntervalOption <= 30 &&
      +this.state.selectedBarGraphIntervalOption > 7
    ) {
      if (
        this.state.selectedXAxisOption === 'month' ||
        this.state.selectedXAxisOption === 'year'
      ) {
        await this.setState({selectedXAxisOption: 'week'})
      }
    } else if (+this.state.selectedBarGraphIntervalOption <= 7) {
      if (
        this.state.selectedXAxisOption === 'week' ||
        this.state.selectedXAxisOption === 'month' ||
        this.state.selectedXAxisOption === 'year'
      ) {
        await this.setState({selectedXAxisOption: 'day'})
      }
    }
    if (this.state.selectedBarGraphIntervalOption !== 'custom') {
      this.props.loadRevenueQueryResultsInterval(
        this.state.selectedBarGraphIntervalOption,
        this.state.selectedQueryTitle,
        this.state.selectedXAxisOption
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

  // eslint-disable-next-line complexity
  async handleSelectedQueryChange(event) {
    await this.setState({
      selectedQueryTitle: event.target.value
    })

    if (this.state.selectedQueryTitle !== 'lunchAndDinnerRevenueComparison') {
      if (
        (this.state.selectedQueryTitle === 'avgRevenuePerGuest' &&
          this.state.selectedXAxisOption === 'avgHour') ||
        (this.state.selectedQueryTitle === 'numberOfOrders' &&
          this.state.selectedXAxisOption === 'DOW')
      ) {
        await this.setState({
          selectedXAxisOption: 'day'
        })
      }
      if (this.state.selectedBarGraphIntervalOption !== 'custom') {
        this.props.loadRevenueQueryResultsInterval(
          this.state.selectedBarGraphIntervalOption,
          this.state.selectedQueryTitle,
          this.state.selectedXAxisOption
        )
      } else if (this.state.startDate && this.state.endDate) {
        const formattedStartDate =
          this.state.startDate.clone().format('YYYY-MM-DD') + ' 00:00:00'
        const formattedEndDate =
          this.state.endDate.clone().format('YYYY-MM-DD') + ' 23:59:59'
        this.props.loadRevenueQueryResultsDate(
          formattedStartDate,
          formattedEndDate,
          this.state.selectedQueryTitle,
          this.state.selectedXAxisOption
        )
      }
    } else {
      this.props.loadRevenueQueryResultsInterval(
        this.state.selectedLineGraphIntervalOption,
        this.state.selectedQueryTitle
      )
    }
  }

  async handleXAxisOptionChange(event) {
    console.log('TRACKING DISABLED: ', event.target.disabled)
    await this.setState({
      selectedXAxisOption: event.target.value
    })
    if (this.state.selectedQueryTitle !== 'lunchAndDinnerRevenueComparison') {
      if (this.state.selectedBarGraphIntervalOption !== 'custom') {
        this.props.loadRevenueQueryResultsInterval(
          this.state.selectedBarGraphIntervalOption,
          this.state.selectedQueryTitle,
          this.state.selectedXAxisOption
        )
      } else if (this.state.startDate && this.state.endDate) {
        const formattedStartDate =
          this.state.startDate.clone().format('YYYY-MM-DD') + ' 00:00:00'
        const formattedEndDate =
          this.state.endDate.clone().format('YYYY-MM-DD') + ' 23:59:59'
        this.props.loadRevenueQueryResultsDate(
          formattedStartDate,
          formattedEndDate,
          this.state.selectedQueryTitle,
          this.state.selectedXAxisOption
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
    return (
      <div className="bus-charts-cont">
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

        {this.state.selectedQueryTitle !== 'lunchAndDinnerRevenueComparison' ? (
          <div className="revenue-graphs-cont">
            <div className="month-button">
              <select
                onChange={this.handleBarGraphIntervalChange}
                className="select-cust"
                defaultValue="30"
              >
                <option value="allPeriod">All History</option>
                <option value="730">Last 2 Years</option>
                <option value="365">Last 1 Year</option>
                <option value="30">Last 30 Days</option>
                <option value="7">Last 7 Days</option>
                <option value="custom">Custom Dates</option>
              </select>
            </div>
            <XAxisOptions
              handleXAxisOptionChange={this.handleXAxisOptionChange}
              selectedQueryTitle={this.state.selectedQueryTitle}
              revenueQueryResults={this.props.revenueQueryResults}
              selectedXAxisOption={this.state.selectedXAxisOption}
            />
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
              selectedXAxisOption={this.state.selectedXAxisOption}
            />
          </div>
        ) : (
          <div className="revenue-graphs-cont">
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
    loadRevenueQueryResultsInterval: (timeInterval, queryTitle, xAxisOption) =>
      dispatch(
        getRevenueQueryResultsInterval(timeInterval, queryTitle, xAxisOption)
      ),
    loadRevenueQueryResultsDate: (
      startDate,
      endDate,
      queryTitle,
      xAxisOption
    ) =>
      dispatch(
        getRevenueQueryResultsDate(startDate, endDate, queryTitle, xAxisOption)
      )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  RevenueAnalyticsGraphs
)

function formatQueryName(name) {
  if (name === 'avgRevenuePerGuest') {
    name = 'Average' + name.slice(3)
  }
  name = name.replace(/([A-Z])/g, ' $1')
  name = name[0].toUpperCase() + name.slice(1)

  return name
}
