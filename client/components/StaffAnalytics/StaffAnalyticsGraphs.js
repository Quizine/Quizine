import 'react-dates/initialize'
import 'react-dates/lib/css/_datepicker.css'
import styled from 'styled-components'
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {
  getWaiterPerformanceQueryResultsInterval,
  getWaiterPerformanceQueryResultsDate
} from '../../store/staffAnalyticsReducer'
import {Bar} from 'react-chartjs-2'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import {makeStyles} from '@material-ui/styles'
import {DateRangePicker} from 'react-dates'
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Button
} from '@material-ui/core'
import moment from 'moment'
import {CSVLink} from 'react-csv'
import {get} from 'https'
import StaffCheckboxField from './StaffCheckboxField'

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

const numberFormatter = new Intl.NumberFormat('en-US')

class WaiterPerformance extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedOption: '30',
      selectedOptionNames: [],
      selectedQueryTitle: 'tipPercentageVsWaiters',
      queryTitleOptions: [
        'tipPercentageVsWaiters',
        'averageExpenditurePerGuestVsWaiters',
        'totalNumberOfGuestsServedVsWaiters'
      ],
      startDate: null,
      endDate: null,
      focusedInput: null
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleDateChange = this.handleDateChange.bind(this)
    this.handleNameChange = this.handleNameChange.bind(this)
    this.handleSelectedQueryChange = this.handleSelectedQueryChange.bind(this)
  }

  componentDidMount() {
    this.props.loadWaiterPerformanceQueryResultsInterval(
      this.state.selectedOption,
      this.state.selectedQueryTitle
    )
  }

  handleChange(event) {
    let formattedSelectedOptionNames
    if (
      this.state.selectedOptionNames &&
      this.state.selectedOptionNames.length
    ) {
      formattedSelectedOptionNames = this.state.selectedOptionNames.map(
        name => {
          return name.value
        }
      )
    } else {
      formattedSelectedOptionNames = []
    }
    this.setState({selectedOption: event.target.value})
    if (event.target.value !== 'custom') {
      this.props.loadWaiterPerformanceQueryResultsInterval(
        event.target.value,
        this.state.selectedQueryTitle,
        formattedSelectedOptionNames
      )
    }
  }

  async handleDateChange({startDate, endDate}) {
    let formattedSelectedOptionNames
    if (
      this.state.selectedOptionNames &&
      this.state.selectedOptionNames.length
    ) {
      formattedSelectedOptionNames = this.state.selectedOptionNames.map(
        name => {
          return name.value
        }
      )
    } else {
      formattedSelectedOptionNames = []
    }
    await this.setState({
      startDate,
      endDate
    })
    if (this.state.startDate && this.state.endDate) {
      const formattedStartDate =
        this.state.startDate.clone().format('YYYY-MM-DD') + ' 00:00:00'
      const formattedEndDate =
        this.state.endDate.clone().format('YYYY-MM-DD') + ' 23:59:59'
      this.props.loadWaiterPerformanceQueryResultsDate(
        formattedStartDate,
        formattedEndDate,
        this.state.selectedQueryTitle,
        formattedSelectedOptionNames
      )
    }
  }

  async handleNameChange(selectedOptionNames) {
    let formattedSelectedOptionNames
    if (selectedOptionNames) {
      formattedSelectedOptionNames = selectedOptionNames.map(name => {
        return name.value
      })
    } else {
      formattedSelectedOptionNames = []
    }
    await this.setState({selectedOptionNames})
    if (this.state.selectedOption !== 'custom') {
      this.props.loadWaiterPerformanceQueryResultsInterval(
        this.state.selectedOption,
        this.state.selectedQueryTitle,
        formattedSelectedOptionNames
      )
    } else if (this.state.startDate && this.state.endDate) {
      const formattedStartDate =
        this.state.startDate.clone().format('YYYY-MM-DD') + ' 00:00:00'
      const formattedEndDate =
        this.state.endDate.clone().format('YYYY-MM-DD') + ' 23:59:59'
      this.props.loadWaiterPerformanceQueryResultsDate(
        formattedStartDate,
        formattedEndDate,
        this.state.selectedQueryTitle,
        formattedSelectedOptionNames
      )
    }
  }

  async handleSelectedQueryChange(event) {
    let formattedSelectedOptionNames
    await this.setState({
      selectedQueryTitle: event.target.value
    })
    if (
      this.state.selectedOptionNames &&
      this.state.selectedOptionNames.length
    ) {
      formattedSelectedOptionNames = this.state.selectedOptionNames.map(
        name => {
          return name.value
        }
      )
    } else {
      formattedSelectedOptionNames = []
    }
    if (this.state.selectedOption !== 'custom') {
      this.props.loadWaiterPerformanceQueryResultsInterval(
        this.state.selectedOption,
        this.state.selectedQueryTitle,
        formattedSelectedOptionNames
      )
    } else if (this.state.startDate && this.state.endDate) {
      const formattedStartDate =
        this.state.startDate.clone().format('YYYY-MM-DD') + ' 00:00:00'
      const formattedEndDate =
        this.state.endDate.clone().format('YYYY-MM-DD') + ' 23:59:59'
      this.props.loadWaiterPerformanceQueryResultsDate(
        formattedStartDate,
        formattedEndDate,
        this.state.selectedQueryTitle,
        formattedSelectedOptionNames
      )
    }
  }

  render() {
    const labels = this.props.waiterPerformanceQueryResults.xAxis
    const yAxis = this.props.waiterPerformanceQueryResults.yAxis
    const selectedQueryTitle = this.state.selectedQueryTitle

    const chartData = {
      labels: labels,
      datasets: [
        {
          display: false,
          label: '',
          data: yAxis,
          backgroundColor: '#AF8BAF',
          hoverBackgroundColor: '#584153',
          borderColor: '#584153'
        }
      ]
    }
    const queryData = chartData.datasets[0].data
    if (!queryData) {
      return <h6>loading...</h6>
    }
    return (
      <div className="bus-charts-cont">
        <div className="analytics-page-cont">
          <div className="staff-query-selector">
            <div className="staff-query-selector">
              <h3 style={{marginBottom: '10px'}}>Data Analysis Category:</h3>
              <select
                className="select-cust-query"
                onChange={this.handleSelectedQueryChange}
              >
                {this.state.queryTitleOptions.map((query, idx) => {
                  return (
                    <option key={idx} value={query}>
                      {formatQueryName(query).slice(0, -11)}
                    </option>
                  )
                })}
              </select>
            </div>
            <div className="staff-time-selector">
              <h3 style={{marginTop: '30px', marginBottom: '10px'}}>
                Time Period:
              </h3>
              <div className="month-button">
                <select
                  onChange={this.handleChange}
                  className="select-cust-time-interval"
                  defaultValue="30"
                >
                  <option value="365">Last 1 Year</option>
                  <option value="30">Last 30 Days</option>
                  <option value="7">Last 7 Days</option>
                  <option value="custom">Custom Dates</option>
                </select>
              </div>
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
            <div className="staff-name-selector">
              <h3
                style={{marginTop: '30px', marginBottom: '10px'}}
                align="center"
              >
                Staff Names:
              </h3>
              {this.props.allNames ? (
                <StaffCheckboxField
                  optionNames={this.state.selectedOptionNames}
                  nameChange={this.handleNameChange}
                  allNames={this.props.allNames}
                />
              ) : null}
            </div>
          </div>
          <div className="analytics-divider">
            <Divider />
          </div>
          <div className="revenue-graphs-cont">
            <div className="revenue-graph-div">
              <Card className={clsx('classes.root, className')}>
                <CardHeader
                  title={formatQueryName(this.state.selectedQueryTitle).slice(
                    0,
                    -11
                  )}
                  style={{textAlign: 'center'}}
                />

                <Divider />

                <CardContent>
                  <div className="classes.chartContainer">
                    <Bar
                      data={chartData}
                      options={{
                        legend: {
                          display: false
                        },
                        title: {
                          display: false,
                          text: ''
                        },
                        plugins: {
                          datalabels: {
                            display: false
                          }
                        },
                        scales: {
                          yAxes: [
                            {
                              display: true,
                              ticks: {
                                suggestedMin: 0,
                                suggestedMax: queryData.max() * 1.1,
                                callback: function(value) {
                                  if (
                                    selectedQueryTitle ===
                                    'tipPercentageVsWaiters'
                                  ) {
                                    return value + '%'
                                  } else if (
                                    selectedQueryTitle ===
                                    'averageExpenditurePerGuestVsWaiters'
                                  ) {
                                    return '$' + value
                                  }
                                  return numberFormatter.format(value)
                                }
                              }
                            }
                          ]
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
              <div className="csv-btn-div">
                <button type="button" className="download-btn">
                  <CSVLink
                    data={tableDataFormatting(
                      formatQueryName(this.state.selectedQueryTitle).slice(
                        0,
                        -11
                      ),
                      labels,
                      yAxis
                    )}
                  >
                    Download CSV
                  </CSVLink>
                </button>
              </div>
            </div>
          </div>
          <div className="analytics-divider">
            <Divider />
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    waiterPerformanceQueryResults:
      state.staffAnalytics.waiterPerformanceQueryResults,
    allNames: state.staffAnalytics.allNames
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadWaiterPerformanceQueryResultsInterval(
      timeInterval,
      queryTitle,
      waiterNames
    ) {
      dispatch(
        getWaiterPerformanceQueryResultsInterval(
          timeInterval,
          queryTitle,
          waiterNames
        )
      )
    },
    loadWaiterPerformanceQueryResultsDate(
      startDate,
      endDate,
      queryTitle,
      waiterNames
    ) {
      dispatch(
        getWaiterPerformanceQueryResultsDate(
          startDate,
          endDate,
          queryTitle,
          waiterNames
        )
      )
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WaiterPerformance)

function formatQueryName(name) {
  name = name.replace(/([A-Z])/g, ' $1')
  name = name[0].toUpperCase() + name.slice(1)
  return name
}

function tableDataFormatting(nameYAxis, xAxis, yAxis) {
  let result = [['Waiter', nameYAxis]]
  for (let i = 0; i < xAxis.length; i++) {
    result.push([xAxis[i], yAxis[i]])
  }
  return result
}
