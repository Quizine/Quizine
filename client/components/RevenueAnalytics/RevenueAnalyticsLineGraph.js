import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Line} from 'react-chartjs-2'
import {getMonthlyRevenueVsLunchVsDinner} from '../../store/revenueAnalyticsReducer'
import clsx from 'clsx'
import {Card, CardHeader, CardContent, Divider} from '@material-ui/core'

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
})

export default class RevenueAnalyticsLineGraph extends Component {
  // constructor(props) {
  //   super(props)

  //   this.state = {
  //     selectedOption: 'oneYear'
  //   }
  //   this.handleChange = this.handleChange.bind(this)
  // }

  // componentDidMount() {
  //   this.props.loadMonthlyRevenueVsLunchVsDinner(this.state.selectedOption)
  // }

  // handleChange(event) {
  //   event.preventDefault()
  //   this.setState({selectedOption: event.target.value})
  //   if (!Object.keys(this.props.lineChartData[event.target.value]).length) {
  //     this.props.loadMonthlyRevenueVsLunchVsDinner(event.target.value)
  //   }
  // }

  render() {
    const {month, lunchRevenue, dinnerRevenue} = this.props.revenueQueryResults

    const lunchRevenueTotal =
      lunchRevenue && lunchRevenue.reduce((acc, curr) => acc + curr)
    const dinnerRevenueTotal =
      dinnerRevenue && dinnerRevenue.reduce((acc, curr) => acc + curr)

    const chartData = {
      labels: month,
      datasets: [
        {
          fill: false,
          label: 'Lunch Revenue: ' + formatter.format(lunchRevenueTotal),
          data: lunchRevenue,
          backgroundColor: 'rgba(255, 10, 13, 0.1)',
          borderColor: 'red',
          hoverBackgroundColor: 'red',
          pointBackgroundColor: 'black',
          pointRadius: 4
        },
        {
          fill: false,
          label: 'Dinner Revenue: ' + formatter.format(dinnerRevenueTotal),
          data: dinnerRevenue,
          backgroundColor: 'rgba(255, 10, 13, 0.1)',
          borderColor: 'blue',
          hoverBackgroundColor: 'red',
          pointBackgroundColor: 'black',
          pointRadius: 4
        }
      ]
    }
    if (!lunchRevenue) {
      return <div>...loading</div>
    }

    return (
      <div>
        <div className="peak-time-div">
          <Card className={clsx('classes.root, className')}>
            <CardHeader title="Lunch vs Dinner Revenue Comparison ($)" />
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
                            suggestedMin: 0,
                            suggestedMax:
                              Math.max(...lunchRevenue, ...dinnerRevenue) * 1.1,
                            callback: function(value) {
                              return (
                                formatter.format(value / 1000).slice(0, -3) +
                                'K'
                              )
                            }
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

// const mapStateToProps = state => {
//   return {lineChartData: state.revenueAnalytics.monthlyRevenueVsLunchVsDinner}
// }

// const mapDispatchToProps = dispatch => {
//   return {
//     loadMonthlyRevenueVsLunchVsDinner: timeInterval =>
//       dispatch(getMonthlyRevenueVsLunchVsDinner(timeInterval))
//   }
// }

// export default connect(mapStateToProps, mapDispatchToProps)(
//   LineGraphMonthlyRevenueVsLunchVsDinner
// )
