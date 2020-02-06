import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getAvgNumberOfGuestsVsWaitersPerOrder} from '../../store/businessAnalyticsReducer'
import {Bar} from 'react-chartjs-2'

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
    const labels = this.props.avgNumberOfGuestsVsWaitersPerOrder.xAxis
    const yAxis = this.props.avgNumberOfGuestsVsWaitersPerOrder.yAxis

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: 'AVG # of Guests Served',
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
                text: 'Average Number of Guests Served by Waiter per Order'
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
