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
          backgroundColor: 'yellow'
        }
      ]
    }
    return (
      <div className="peak-time-div">
        <select onChange={this.handleChange} defaultValue="month">
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
              },
              scales: {
                yAxes: [
                  {
                    display: true,
                    ticks: {
                      suggestedMin: 0, // minimum will be 0, unless there is a lower value.
                      // OR //
                      beginAtZero: true, // minimum value will be 0.
                      suggestedMax: 30
                    }
                  }
                ]
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
