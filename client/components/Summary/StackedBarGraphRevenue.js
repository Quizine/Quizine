import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Bar} from 'react-chartjs-2'
import {getRevenueVsTime} from '../../store/summaryReducer'
import clsx from 'clsx'
import {Card, CardHeader, CardContent, Divider} from '@material-ui/core'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
})

class StackedBarGraphRevenue extends Component {
  componentDidMount() {
    this.props.loadRevenueVsTime()
  }

  render() {
    const {xAxis, year2018, year2019, year2020} = this.props.revenueSummaryData
    const chartData = {
      labels: xAxis,
      datasets: [
        {
          label: 'Year 2018',
          data: year2018,
          fill: false,
          backgroundColor: '#6886C5',
          borderColor: '#6886C5'
        },
        {
          label: 'Year 2019',
          data: year2019,
          fill: false,
          backgroundColor: '#FFE0AC',
          borderColor: '#FFC38B'
        },
        {
          label: 'Year 2020',
          data: year2020,
          fill: false,
          backgroundColor: '#FFACB7',
          borderColor: '#FFACB7'
        }
      ]
    }
    if (!year2018) {
      return <div>...loading</div>
    }

    return (
      <div className="summary-charts-div">
        <Card className={clsx('classes.root, className')}>
          <CardHeader align="center" title="Revenue per Month" />
          <Divider />
          <CardContent>
            <div className="classes.chartContainer">
              <Bar
                data={chartData}
                options={{
                  plugins: {
                    datalabels: {
                      display: false
                    }
                  },
                  scales: {
                    xAxes: [
                      {
                        stacked: true
                      }
                    ],
                    yAxes: [
                      {
                        display: true,
                        stacked: true,
                        ticks: {
                          suggestedMin: 0,
                          suggestedMax:
                            Math.max(...year2018, ...year2019, ...year2020) *
                            1.1,
                          callback: function(value) {
                            return currencyFormatter.format(value).slice(0, -3)
                          }
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
  return {revenueSummaryData: state.summary.revenueVsTime}
}

const mapDispatchToProps = dispatch => {
  return {
    loadRevenueVsTime: () => dispatch(getRevenueVsTime())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  StackedBarGraphRevenue
)
