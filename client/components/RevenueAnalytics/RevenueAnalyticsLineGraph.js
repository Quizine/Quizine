import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Line} from 'react-chartjs-2'
import clsx from 'clsx'
import {Card, CardHeader, CardContent, Divider} from '@material-ui/core'

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
})

export default class RevenueAnalyticsLineGraph extends Component {
  render() {
    const {
      xAxis,
      lunchRevenue,
      dinnerRevenue,
      startDate
    } = this.props.revenueQueryResults
    const selectedXAxisOption = this.props.selectedXAxisOption

    const lunchRevenueTotal =
      lunchRevenue && lunchRevenue.reduce((acc, curr) => acc + curr)
    const dinnerRevenueTotal =
      dinnerRevenue && dinnerRevenue.reduce((acc, curr) => acc + curr)

    const chartData = {
      labels: xAxis,
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
        <div>
          <h1>TESTING</h1>
        </div>
        <div className="peak-time-div">
          <Card className={clsx('classes.root, className')}>
            <CardHeader
              title={formatQueryName(this.props.selectedQueryTitle)}
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
            {selectedXAxisOption === 'month' ||
            selectedXAxisOption === 'year' ? (
              <h5>Shown data starting from {startDate}</h5>
            ) : null}
          </Card>
        </div>
      </div>
    )
  }
}

function formatQueryName(name) {
  name = name.replace(/([A-Z])/g, ' $1')
  name = name[0].toUpperCase() + name.slice(1)

  return name
}
