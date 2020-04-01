import 'react-dates/initialize'
import 'react-dates/lib/css/_datepicker.css'
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getTipPercentageVsWaiters} from '../../store/staffAnalyticsReducer'
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

class WaiterPerformance extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedOption: '30',
      startDate: null,
      endDate: null,
      focusedInput: [moment('2019/04/08'), moment('2019/05/08')]
    }
    this.handleChange = this.handleChange.bind(this)
    this.setDateRange = this.setDateRange.bind(globalThis)
  }

  componentDidMount() {
    this.props.loadTipPercentageVsWaiters(this.state.selectedOption)
  }

  setDateRange() {
    // if (this.state.endDate && this.state.endDate > moment()) {
    return false
    // }
  }

  handleChange(event) {
    this.setState({selectedOption: event.target.value})
    this.props.loadTipPercentageVsWaiters(event.target.value)
  }

  render() {
    const labels = this.props.tipPercentageVsWaiters.days.xAxis
    const yAxis = this.props.tipPercentageVsWaiters.days.yAxis

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Tip Percentage',
          data: yAxis,
          backgroundColor: 'green'
        }
      ]
    }
    const tipPercentage = chartData.datasets[0].data
    console.log('STATE', this.state)
    if (!tipPercentage) {
      return <h6>loading...</h6>
    } else {
      return (
        <div className="peak-time-div">
          <div>
            <DateRangePicker
              //   showDefaultInputIcon={true}
              //   minimumNights={1}
              showClearDates={true}
              isOutsideRange={() => this.setDateRange()}
              reopenPickerOnClearDates={true}
              //   isOutsideRange={() => false}
              startDate={this.state.startDate} // momentPropTypes.momentObj or null,
              startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
              endDate={this.state.endDate} // momentPropTypes.momentObj or null,
              endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
              onDatesChange={({startDate, endDate}) =>
                this.setState({startDate, endDate})
              } // PropTypes.func.isRequired,
              focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
              onFocusChange={focusedInput => this.setState({focusedInput})} // PropTypes.func.isRequired,
            />
          </div>

          <Card className={clsx('classes.root, className')}>
            <CardHeader
              action={
                <div className="month-button">
                  <select
                    onChange={this.handleChange}
                    className="select-css"
                    defaultValue="30"
                  >
                    <option value="365">Last 365 Days</option>
                    <option value="30">Last 30 Days</option>
                    <option value="7">Last 7 Days</option>
                    <option value="custom">Custom Dates</option>
                  </select>
                </div>
              }
              title="Waiter Performance (%)"
            />

            <Divider />

            <CardContent>
              <div className="classes.chartContainer">
                <Bar
                  data={chartData}
                  options={{
                    title: {
                      display: false,
                      text: 'Waiters Tip Percentage'
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
                            suggestedMax: tipPercentage.max() * 1.1
                          }
                        }
                      ]
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }
  }
}

const mapStateToProps = state => {
  return {
    tipPercentageVsWaiters: state.staffAnalytics.tipPercentageVsWaiters
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadTipPercentageVsWaiters(timeInterval) {
      dispatch(getTipPercentageVsWaiters(timeInterval))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WaiterPerformance)
