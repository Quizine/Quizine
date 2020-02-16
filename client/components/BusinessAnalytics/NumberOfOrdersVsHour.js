import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getNumberOfOrdersVsHour} from '../../store/businessAnalyticsReducer'
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
Array.prototype.max = function() {
  return Math.max.apply(null, this)
}

Array.prototype.min = function() {
  return Math.min.apply(null, this)
}

class NumberOfOrdersVsHour extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedOption: 'month'
    }
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    this.props.loadNumberOfOrdersVsHour(this.state.selectedOption)
  }

  handleChange(event) {
    this.setState({selectedOption: event.target.value})
    if (
      !Object.keys(this.props.numberOfOrdersVsHour[event.target.value]).length
    ) {
      this.props.loadNumberOfOrdersVsHour(event.target.value)
    }
  }

  render() {
    const labels = [
      '11am',
      '12pm',
      '1pm',
      '2pm',
      '3pm',
      '4pm',
      '5pm',
      '6pm',
      '7pm',
      '8pm',
      '9pm'
      // '10pm'
    ]
    const arrPerc = this.props.numberOfOrdersVsHour[this.state.selectedOption]

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Number of Orders',
          data: arrPerc,
          backgroundColor: 'yellow'
        }
      ]
    }
    const orders = chartData.datasets[0].data
    if (!orders) {
      return <h6>loading</h6>
    }
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
                  <option value="year">Year</option>
                  <option value="month">Month</option>
                  <option value="week">Week</option>
                </select>
              </div>
            }
            title="Number of Orders Per Hour"
          />
          <Divider />

          <CardContent>
            <div className="classes.chartContainer">
              <Bar
                data={chartData}
                options={{
                  title: {
                    display: false,
                    text: 'Number of Orders Per Hour'
                  },
                  plugins: {
                    datalabels: {
                      display: false
                    }
                  },
                  scales: {
                    yAxes: [
                      {
                        ticks: {
                          suggestedMax: orders.min(),
                          suggestedMin: orders.max()
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
    numberOfOrdersVsHour: state.businessAnalytics.numberOfOrdersVsHour
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadNumberOfOrdersVsHour: timeInterval =>
      dispatch(getNumberOfOrdersVsHour(timeInterval))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  NumberOfOrdersVsHour
)
