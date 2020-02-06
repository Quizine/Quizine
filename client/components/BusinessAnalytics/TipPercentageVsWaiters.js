import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getTipPercentageVsWaiters} from '../../store/businessAnalyticsReducer'
import {Bar} from 'react-chartjs-2'

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
    const labels = this.props.tipPercentageVsWaiters.xAxis
    const yAxis = this.props.tipPercentageVsWaiters.yAxis

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Tip Percentage',
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
                text: 'Waiters Tip Percentage'
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
    tipPercentageVsWaiters: state.stockQueries.tipPercentageVsWaiters
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
