import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getAvgRevenuePerGuestVsDOW} from '../../store/businessAnalyticsReducer'
import {Bar} from 'react-chartjs-2'

class AvgRevenuePerGuestVsDOW extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedOption: 'month'
    }
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    this.props.loadAvgRevenuePerGuestVsDOW(this.state.selectedOption)
  }

  handleChange(event) {
    console.log(`in the working`, this.props)
    this.setState({selectedOption: event.target.value})
    if (
      !Object.keys(this.props.avgRevenuePerGuestVsDOW[event.target.value])
        .length
    ) {
      this.props.loadAvgRevenuePerGuestVsDOW(event.target.value)
    }
  }

  render() {
    const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat']
    const arrPerc = this.props.avgRevenuePerGuestVsDOW[
      this.state.selectedOption
    ]

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Average Revenue per Guest, $',
          data: arrPerc,
          backgroundColor: 'yellow'
        }
      ]
    }

    return (
      <div className="peak-time-div">
        <select onChange={this.handleChange} defaultValue="month">
          <option value="year">Year</option>
          <option value="month">Month</option>
          <option value="week">Week</option>
        </select>
        <div>
          <Bar
            data={chartData}
            options={{
              title: {
                display: true,
                text: 'Average Revenue Per Guest Per Day of Week'
              },
              scales: {
                yAxes: [
                  {
                    ticks: {
                      beginAtZero: true,
                      suggestedMax: 100
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
    avgRevenuePerGuestVsDOW: state.businessAnalytics.avgRevenuePerGuestVsDOW
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadAvgRevenuePerGuestVsDOW: timeInterval =>
      dispatch(getAvgRevenuePerGuestVsDOW(timeInterval))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  AvgRevenuePerGuestVsDOW
)
