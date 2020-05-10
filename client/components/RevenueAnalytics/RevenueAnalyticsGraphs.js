import 'react-dates/initialize'
import 'react-dates/lib/css/_datepicker.css'
import styled from 'styled-components'
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {
  getRevenueQueryResultsDate,
  getRevenueQueryResultsInterval
} from '../../store/revenueAnalyticsReducer'
import RevenueAndOrdersGraphs from './RevenueAndOrdersGraphs'
import RevenueLunchAndDinnerGraph from './RevenueLunchAndDinnerGraph'
import XAxisOptions from './XAxisOptions'
import AggOptions from './AggOptions'
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
      queryTitleOptions: [
        'detailedRevenueAnalysis',
        'detailedOrderAnalysis',
        'lunchAndDinnerRevenueComparison'
      ],
      selectedIntervalOption: '30',
      selectedXAxisOption: 'day',
      selectedGraphOption: 'bar',
      selectedAggOption: 'sum',
      selectedQueryTitle: 'detailedRevenueAnalysis',
      startDate: null,
      endDate: null,
      focusedInput: null
    }
    this.handleGraphIntervalChange = this.handleGraphIntervalChange.bind(this)
    this.handleSelectedQueryChange = this.handleSelectedQueryChange.bind(this)
    this.handleDateChange = this.handleDateChange.bind(this)
    this.handleXAxisOptionChange = this.handleXAxisOptionChange.bind(this)
    this.handleGraphOptionChange = this.handleGraphOptionChange.bind(this)
    this.handleAggOptionChange = this.handleAggOptionChange.bind(this)
  }

  componentDidMount() {
    this.props.loadRevenueQueryResultsInterval(
      this.state.selectedIntervalOption,
      this.state.selectedQueryTitle,
      this.state.selectedXAxisOption,
      this.state.selectedAggOption
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
        this.state.selectedXAxisOption,
        this.state.selectedAggOption
      )
    }
  }

  // eslint-disable-next-line complexity
  async handleGraphIntervalChange(event) {
    await this.setState({selectedIntervalOption: event.target.value})
    if (
      this.state.selectedIntervalOption === 'allPeriod' ||
      +this.state.selectedIntervalOption > 365
    ) {
      if (this.state.selectedXAxisOption === 'hour') {
        await this.setState({selectedXAxisOption: 'day'})
      }
    } else if (+this.state.selectedIntervalOption === 365) {
      if (this.state.selectedXAxisOption === 'year') {
        await this.setState({selectedXAxisOption: 'month'})
      } else if (this.state.selectedXAxisOption === 'hour') {
        await this.setState({selectedXAxisOption: 'day'})
      }
    } else if (
      +this.state.selectedIntervalOption <= 30 &&
      +this.state.selectedIntervalOption > 7
    ) {
      if (
        this.state.selectedXAxisOption === 'month' ||
        this.state.selectedXAxisOption === 'year'
      ) {
        await this.setState({selectedXAxisOption: 'week'})
      }
    } else if (+this.state.selectedIntervalOption <= 7) {
      if (
        this.state.selectedXAxisOption === 'week' ||
        this.state.selectedXAxisOption === 'month' ||
        this.state.selectedXAxisOption === 'year'
      ) {
        await this.setState({selectedXAxisOption: 'day'})
      }
    }
    if (this.state.selectedIntervalOption !== 'custom') {
      this.props.loadRevenueQueryResultsInterval(
        this.state.selectedIntervalOption,
        this.state.selectedQueryTitle,
        this.state.selectedXAxisOption,
        this.state.selectedAggOption
      )
    }
  }

  // eslint-disable-next-line complexity
  async handleSelectedQueryChange(event) {
    await this.setState({
      selectedQueryTitle: event.target.value
    })
    if (
      (this.state.selectedQueryTitle === 'detailedRevenueAnalysis' &&
        this.state.selectedXAxisOption === 'avgHour') ||
      (this.state.selectedQueryTitle === 'detailedOrderAnalysis' &&
        this.state.selectedXAxisOption === 'DOW') ||
      (this.state.selectedQueryTitle === 'lunchAndDinnerRevenueComparison' &&
        this.state.selectedXAxisOption === 'avgHour') ||
      (this.state.selectedQueryTitle === 'lunchAndDinnerRevenueComparison' &&
        this.state.selectedXAxisOption === 'DOW')
    ) {
      await this.setState({
        selectedXAxisOption: 'day'
      })
    }
    if (
      (this.state.selectedQueryTitle === 'detailedRevenueAnalysis' &&
        this.state.selectedAggOption === 'numberOfOrders') ||
      (this.state.selectedQueryTitle === 'detailedOrderAnalysis' &&
        this.state.selectedAggOption === 'avgRevenuePerGuest')
    ) {
      await this.setState({
        selectedAggOption: 'sum'
      })
    }

    if (this.state.selectedIntervalOption !== 'custom') {
      this.props.loadRevenueQueryResultsInterval(
        this.state.selectedIntervalOption,
        this.state.selectedQueryTitle,
        this.state.selectedXAxisOption,
        this.state.selectedAggOption
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
        this.state.selectedXAxisOption,
        this.state.selectedAggOption
      )
    }
  }

  async handleXAxisOptionChange(event) {
    await this.setState({
      selectedXAxisOption: event.target.value
    })
    if (this.state.selectedIntervalOption !== 'custom') {
      this.props.loadRevenueQueryResultsInterval(
        this.state.selectedIntervalOption,
        this.state.selectedQueryTitle,
        this.state.selectedXAxisOption,
        this.state.selectedAggOption
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
        this.state.selectedXAxisOption,
        this.state.selectedAggOption
      )
    }
  }

  async handleAggOptionChange(event) {
    await this.setState({
      selectedAggOption: event.target.value
    })
    if (this.state.selectedIntervalOption !== 'custom') {
      this.props.loadRevenueQueryResultsInterval(
        this.state.selectedIntervalOption,
        this.state.selectedQueryTitle,
        this.state.selectedXAxisOption,
        this.state.selectedAggOption
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
        this.state.selectedXAxisOption,
        this.state.selectedAggOption
      )
    }
  }

  async handleGraphOptionChange(event) {
    const formattedGraphOption = event.target.innerText
      .slice(0, -6)
      .toLowerCase()
    await this.setState({
      selectedGraphOption: formattedGraphOption
    })
  }

  render() {
    return (
      <div className="bus-charts-cont">
        <div className="analytics-page-cont">
          <div className="query-selector">
            {/* <div className="category-time-selector"> */}
            <div className="category-selector">
              <h3 style={{marginBottom: '10px'}}>Data Analysis Category:</h3>
              <select
                className="select-cust-query"
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
            {/* </div> */}
            <div className="axis-time-selector">
              {this.state.selectedQueryTitle !==
              'lunchAndDinnerRevenueComparison' ? (
                <div className="y-Axis-selector">
                  <AggOptions
                    selectedAggOption={this.state.selectedAggOption}
                    selectedQueryTitle={this.state.selectedQueryTitle}
                    handleAggOptionChange={this.handleAggOptionChange}
                  />
                </div>
              ) : null}
              <div className="x-Axis-selector">
                <XAxisOptions
                  handleXAxisOptionChange={this.handleXAxisOptionChange}
                  selectedQueryTitle={this.state.selectedQueryTitle}
                  revenueQueryResults={this.props.revenueQueryResults}
                  selectedXAxisOption={this.state.selectedXAxisOption}
                />
              </div>
              <div className="time-selector">
                <h3 style={{marginBottom: '10px'}}>Time Period:</h3>
                <div className="month-button">
                  <select
                    onChange={this.handleGraphIntervalChange}
                    className="select-cust-time-interval"
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
                {this.state.selectedIntervalOption === 'custom' ? (
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
            </div>
          </div>
          {this.state.selectedQueryTitle !==
          'lunchAndDinnerRevenueComparison' ? (
            <div className="revenue-graphs-cont">
              <RevenueAndOrdersGraphs
                selectedQueryTitle={this.state.selectedQueryTitle}
                revenueQueryResults={this.props.revenueQueryResults}
                selectedXAxisOption={this.state.selectedXAxisOption}
                selectedGraphOption={this.state.selectedGraphOption}
                handleGraphOptionChange={this.handleGraphOptionChange}
                selectedAggOption={this.state.selectedAggOption}
                handleAggOptionChange={this.handleAggOptionChange}
              />
            </div>
          ) : (
            <div className="revenue-graphs-cont">
              <RevenueLunchAndDinnerGraph
                selectedQueryTitle={this.state.selectedQueryTitle}
                revenueQueryResults={this.props.revenueQueryResults}
                selectedXAxisOption={this.state.selectedXAxisOption}
                selectedGraphOption={this.state.selectedGraphOption}
                handleGraphOptionChange={this.handleGraphOptionChange}
              />
            </div>
          )}
        </div>
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
    loadRevenueQueryResultsInterval: (
      timeInterval,
      queryTitle,
      xAxisOption,
      aggOption
    ) =>
      dispatch(
        getRevenueQueryResultsInterval(
          timeInterval,
          queryTitle,
          xAxisOption,
          aggOption
        )
      ),
    loadRevenueQueryResultsDate: (
      startDate,
      endDate,
      queryTitle,
      xAxisOption,
      aggOption
    ) =>
      dispatch(
        getRevenueQueryResultsDate(
          startDate,
          endDate,
          queryTitle,
          xAxisOption,
          aggOption
        )
      )
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
