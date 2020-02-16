import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Line} from 'react-chartjs-2'
import {getMonthlyRevenueVsLunchVsDinner} from '../../store/businessAnalyticsReducer'
import clsx from 'clsx'
import {Card, CardHeader, CardContent, Divider} from '@material-ui/core'

class LineGraphMonthlyRevenueVsLunchVsDinner extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedOption: 'oneYear'
    }
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    this.props.loadMonthlyRevenueVsLunchVsDinner(this.state.selectedOption)
  }

  handleChange(event) {
    event.preventDefault()
    this.setState({selectedOption: event.target.value})
    if (!Object.keys(this.props.lineChartData[event.target.value]).length) {
      this.props.loadMonthlyRevenueVsLunchVsDinner(event.target.value)
    }
  }

  render() {
    const {lunchMonth, lunchRevenue, dinnerRevenue} = this.props.lineChartData[
      this.state.selectedOption
    ]
    const chartData = {
      labels: lunchMonth,
      datasets: [
        {
          fill: false,
          label: 'Lunch Revenue',
          data: lunchRevenue,
          backgroundColor: 'rgba(255, 10, 13, 0.1)',
          borderColor: 'red',
          hoverBackgroundColor: 'red',
          pointBackgroundColor: 'black',
          pointRadius: 4
        },
        {
          fill: false,
          label: 'Dinner Revenue',
          data: dinnerRevenue,
          backgroundColor: 'rgba(255, 10, 13, 0.1)',
          borderColor: 'blue',
          hoverBackgroundColor: 'red',
          pointBackgroundColor: 'black',
          pointRadius: 4
        }
      ]
    }

    return (
      <div>
        <div className="peak-time-div">
          <Card className={clsx('classes.root, className')}>
            <CardHeader
              action={
                <select onChange={this.handleChange} className="select-css">
                  <option value="oneYear">Last Year</option>
                  <option value="twoYears">Last 2 Years</option>
                  <option value="allPeriod">All Time</option>
                </select>
              }
              title="Lunch vs Dinner Revenue Comparison ($)"
            />
            <Divider />
            <CardContent>
              <div className="classes.chartContainer">
                <Line
                  data={chartData}
                  options={{
                    scales: {
                      yAxes: [
                        {
                          display: true,
                          ticks: {
                            suggestedMin: 30000,
                            suggestedMax: 100000
                          }
                        }
                      ]
                    },
                    plugins: {
                      datalabels: {
                        display: false
                      }
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {lineChartData: state.businessAnalytics.monthlyRevenueVsLunchVsDinner}
}

const mapDispatchToProps = dispatch => {
  return {
    loadMonthlyRevenueVsLunchVsDinner: timeInterval =>
      dispatch(getMonthlyRevenueVsLunchVsDinner(timeInterval))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  LineGraphMonthlyRevenueVsLunchVsDinner
)
