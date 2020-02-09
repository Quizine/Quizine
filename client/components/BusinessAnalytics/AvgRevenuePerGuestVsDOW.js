import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getAvgRevenuePerGuestVsDOW} from '../../store/businessAnalyticsReducer'
import {Bar} from 'react-chartjs-2'
import clsx from 'clsx'
import {Card, CardHeader, CardContent, Divider} from '@material-ui/core'

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
          label: 'Average Revenue per Guest',
          data: arrPerc,
          backgroundColor: '#24497A'
        }
      ]
    }

    return (
      <div className="peak-time-div">
        <Card className={clsx('classes.root, className')}>
          <CardHeader
            action={
              <select onChange={this.handleChange} className="select-css">
                <option value="month">Month</option>
                <option value="year">Year</option>
                <option value="week">Week</option>
              </select>
            }
            title="Guest Expenditure ($)"
          />
          <Divider />

          <CardContent>
            <div className="classes.chartContainer">
              <Bar
                data={chartData}
                options={{
                  title: {
                    display: false,
                    text: 'Average Revenue Per Guest ($)'
                  },
                  scales: {
                    yAxes: [
                      {
                        ticks: {
                          suggestedMax: 75,
                          suggestedMin: 45
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
