import React, {Component} from 'react'
import {Bar} from 'react-chartjs-2'
import clsx from 'clsx'
import {Card, CardHeader, CardContent, Divider} from '@material-ui/core'

export default class RevenueAnalyticsBarGraphs extends Component {
  render() {
    const labels = this.props.revenueQueryResults.xAxis
    const yAxis = this.props.revenueQueryResults.yAxis

    const chartData = {
      labels: labels,
      datasets: [
        {
          display: false,
          label: '',
          data: yAxis,
          backgroundColor: '#24497A'
        }
      ]
    }
    const queryData = chartData.datasets[0].data
    const {selectedQueryTitle} = this.props
    if (!queryData) {
      return <h6>loading...</h6>
    }
    return (
      <div className="peak-time-div">
        <Card className={clsx('classes.root, className')}>
          <CardHeader title={formatQueryName(selectedQueryTitle)} />
          <Divider />

          <CardContent>
            <div className="classes.chartContainer">
              <Bar
                data={chartData}
                options={{
                  title: {
                    display: false
                  },
                  plugins: {
                    datalabels: {
                      display: false
                    }
                  },
                  scales: {
                    yAxes: [
                      {
                        ticks: {
                          suggestedMin: 0,
                          suggestedMax: queryData.max() * 1.1,
                          callback: function(value) {
                            if (
                              selectedQueryTitle === 'avgRevenuePerGuestVsDOW'
                            ) {
                              return '$' + value
                            }
                            return value
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

function formatQueryName(name) {
  if (name === 'avgRevenuePerGuestVsDOW') {
    name = 'Average' + name.slice(3, -5)
  } else if (name === 'numberOfOrdersVsHour') {
    name = name.slice(0, -6)
  }
  name = name.replace(/([A-Z])/g, ' $1')
  name = name[0].toUpperCase() + name.slice(1)

  return name
}