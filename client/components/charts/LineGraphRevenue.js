import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Line} from 'react-chartjs-2'
import {getRevenueVsTime} from '../../store/summaryReducer'

class LineGraphRevenue extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedOption: 'oneYear'
    }
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    this.props.loadRevenueVsTime(this.state.selectedOption)
  }

  handleChange(event) {
    this.setState({selectedOption: event.target.value})
    if (!Object.keys(this.props.lineChartData[event.target.value]).length) {
      this.props.loadRevenueVsTime(event.target.value)
    }
  }

  render() {
    const {month, revenue} = this.props.lineChartData[this.state.selectedOption]
    console.log(month)

    const chartData = {
      labels: month,
      datasets: [
        {
          label: 'REVENUE',
          data: revenue,
          backgroundColor: 'lightgreen',
          borderColor: 'yellow',
          hoverBackgroundColor: 'red',
          pointBackgroundColor: 'black',
          pointRadius: 4
        }
      ]
    }
    return (
      <div className="rev-time-div">
        <select onChange={this.handleChange}>
          <option value="oneYear">Last Year</option>
          <option value="twoYears">Last 2 Years</option>
          <option value="allPeriod">All History</option>
        </select>
        <div>
          <Line
            data={chartData}
            options={{
              title: {
                display: true,
                text: 'REVENUE vs TIME'
              }
            }}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {lineChartData: state.summary.revenueVsTime}
}

const mapDispatchToProps = dispatch => {
  return {
    loadRevenueVsTime: timeInterval => dispatch(getRevenueVsTime(timeInterval))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LineGraphRevenue)
