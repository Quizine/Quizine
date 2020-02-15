import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getAvgNumberOfGuestsVsWaitersPerOrder} from '../../store/businessAnalyticsReducer'
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

//these were used for dynamic rendering
// Array.prototype.max = function() {
//   return Math.max.apply(null, this)
// }

// Array.prototype.min = function() {
//   return Math.min.apply(null, this)
// }

class AvgNumberOfGuestsVsWaitersPerOrder extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedOption: 'month'
    }
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    this.props.loadAvgNumberOfGuestsVsWaitersPerOrder(this.state.selectedOption)
  }

  handleChange(event) {
    this.setState({selectedOption: event.target.value})
    if (
      !Object.keys(
        this.props.avgNumberOfGuestsVsWaitersPerOrder[event.target.value]
      ).length
    ) {
      this.props.loadAvgNumberOfGuestsVsWaitersPerOrder(event.target.value)
    }
  }

  render() {
    const labels = this.props.avgNumberOfGuestsVsWaitersPerOrder[
      this.state.selectedOption
    ].xAxis
    const yAxis = this.props.avgNumberOfGuestsVsWaitersPerOrder[
      this.state.selectedOption
    ].yAxis

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Average Number of Guests Served',
          data: yAxis,
          backgroundColor: '#bb4a4a'
        }
      ]
    }
    const avgNumberOfGuests = chartData.datasets[0].data

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
            title="Waiter-Client Engagement (%)"
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
                  scales: {
                    yAxes: [
                      {
                        display: true,
                        ticks: {
                          suggestedMin: 3.5,
                          suggestedMax: 5
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

const mapStateToProps = state => {
  return {
    avgNumberOfGuestsVsWaitersPerOrder:
      state.businessAnalytics.avgNumberOfGuestsVsWaitersPerOrder
  }
}
const mapDispatchToProps = dispatch => {
  return {
    loadAvgNumberOfGuestsVsWaitersPerOrder(timeInterval) {
      dispatch(getAvgNumberOfGuestsVsWaitersPerOrder(timeInterval))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  AvgNumberOfGuestsVsWaitersPerOrder
)
