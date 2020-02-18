import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getTipPercentageVsWaiters} from '../../store/businessAnalyticsReducer'
import {Bar} from 'react-chartjs-2'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import {makeStyles} from '@material-ui/styles'
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Button
} from '@material-ui/core'

//UTILITY FUNCTIONS:
// Array.prototype.max = function() {
//   return Math.max.apply(null, this)
// }

// Array.prototype.min = function() {
//   return Math.min.apply(null, this)
// }

class TipPercentageVsWaiters extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedOption: 'month'
    }
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    this.props.loadTipPercentageVsWaiters(this.state.selectedOption)
  }

  handleChange(event) {
    this.setState({selectedOption: event.target.value})
    if (
      !Object.keys(this.props.tipPercentageVsWaiters[event.target.value]).length
    ) {
      this.props.loadTipPercentageVsWaiters(event.target.value)
    }
  }

  render() {
    const labels = this.props.tipPercentageVsWaiters[this.state.selectedOption]
      .xAxis
    const yAxis = this.props.tipPercentageVsWaiters[this.state.selectedOption]
      .yAxis

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
    if (!tipPercentage) {
      return <h6>loading...</h6>
    } else {
      return (
        <div className="peak-time-div">
          <Card className={clsx('classes.root, className')}>
            <CardHeader
              action={
                <div className="month-button">
                  <select
                    onChange={this.handleChange}
                    className="select-css"
                    defaultValue="month"
                  >
                    <option value="month">Month</option>
                    <option value="year">Year</option>
                    <option value="week">Week</option>
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
                            suggestedMin: tipPercentage.min() * 0.8,
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
    tipPercentageVsWaiters: state.businessAnalytics.tipPercentageVsWaiters
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadTipPercentageVsWaiters(timeInterval) {
      dispatch(getTipPercentageVsWaiters(timeInterval))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  TipPercentageVsWaiters
)
