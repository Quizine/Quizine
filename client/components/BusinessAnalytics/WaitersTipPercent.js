import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getTipPercentageChart} from '../../store/stockQueryReducer'
import {Bar} from 'react-chartjs-2'

class WaitersTipPercentGraph extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedOption: 'month'
    }
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    this.props.loadtipPercentageChart(this.state.selectedOption)
  }

  handleChange(event) {
    this.setState({selectedOption: event.target.value})
    if (
      !Object.keys(this.props.tipPercentageChart[event.target.value]).length
    ) {
      this.props.loadtipPercentageChart(event.target.value)
    }
  }

  render() {
    const labels = this.props.tipPercentageChart.xAxis
    const yAxis = this.props.tipPercentageChart.yAxis

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
    tipPercentageChart: state.stockQueries.tipPercentageChart
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadtipPercentageChart(timeInterval) {
      dispatch(getTipPercentageChart(timeInterval))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  WaitersTipPercentGraph
)
