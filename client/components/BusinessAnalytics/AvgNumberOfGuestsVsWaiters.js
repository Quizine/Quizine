import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getAvgNumberOfGuestsVsWaiters} from '../../store/businessAnalyticsReducer'
import {Bar} from 'react-chartjs-2'

class AvgNumberOfGuestsVsWaiters extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedOption: 'month'
    }
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    this.props.loadAvgNumberOfGuestsVsWaiters(this.state.selectedOption)
  }

  handleChange(event) {
    this.setState({selectedOption: event.target.value})
    if (
      !Object.keys(this.props.avgNumberOfGuestsVsWaiters[event.target.value])
        .length
    ) {
      this.props.loadAvgNumberOfGuestsVsWaiters(event.target.value)
    }
  }

  render() {
    const labels = this.props.avgNumberOfGuestsVsWaiters.xAxis
    const yAxis = this.props.avgNumberOfGuestsVsWaiters.yAxis

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Performance',
          data: yAxis,
          backgroundColor: 'yellow'
        }
      ]
    }
    return (
      <div className="peak-time-div">
        <select onChange={this.handleChange}>
          <option value="month">Month</option>
          <option value="year">Year</option>
          <option value="week">Week</option>
        </select>
        <div>
          <Bar
            data={chartData}
            options={{
              title: {
                display: true,
                text: 'Average Number of Guests Served by Each Waiter'
              }
            }}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    avgNumberOfGuestsVsWaiters:
      state.businessAnalytics.avgNumberOfGuestsVsWaiters
  }
}
const mapDispatchToProps = dispatch => {
  return {
    loadAvgNumberOfGuestsVsWaiters(timeInterval) {
      dispatch(getAvgNumberOfGuestsVsWaiters(timeInterval))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  AvgNumberOfGuestsVsWaiters
)
