import React, {Component} from 'react'
import {Line, Bar} from 'react-chartjs-2'
import clsx from 'clsx'
import {Card, CardHeader, CardContent, Divider} from '@material-ui/core'
import GraphOptionButtons from './GraphOptionButtons'

export default class RevenueAnalyticsBarGraphs extends Component {
  // eslint-disable-next-line complexity
  render() {
    const labels = this.props.revenueQueryResults.xAxis
    const yAxis = this.props.revenueQueryResults.yAxis
    const startDate = this.props.revenueQueryResults.startDate
    const selectedXAxisOption = this.props.selectedXAxisOption
    const selectedGraphOption = this.props.selectedGraphOption
    const handleGraphOptionChange = this.props.handleGraphOptionChange
    const selectedQueryTitle = this.props.selectedQueryTitle

    //const aggYAxis = selectedQueryTitle ==='numberOfOrders' ?

    const chartData = {
      labels: labels,
      datasets: [
        {
          display: false,
          fill: false,
          label: '',
          data: yAxis,
          backgroundColor:
            selectedQueryTitle === 'numberOfOrders' ? '#F79071' : '#16817A',
          borderColor:
            selectedQueryTitle === 'numberOfOrders' ? '#F79071' : '#16817A',
          hoverBackgroundColor:
            selectedQueryTitle === 'numberOfOrders' ? '#FA744f' : '#024249',
          pointBackgroundColor:
            selectedQueryTitle === 'numberOfOrders' ? '#F79071' : '#16817A',
          pointRadius: 2
        }
      ]
    }
    const queryData = chartData.datasets[0].data
    const GraphOption = selectedGraphOption === 'line' ? Line : Bar
    if (!queryData) {
      return <h6>loading...</h6>
    }
    return (
      <div className="peak-time-div">
        <Card className={clsx('classes.root, className')}>
          <CardHeader title={formatQueryName(selectedQueryTitle)} />
          <GraphOptionButtons
            handleGraphOptionChange={handleGraphOptionChange}
            selectedQueryTitle={selectedQueryTitle}
            selectedGraphOption={selectedGraphOption}
          />
          <Divider />

          <CardContent>
            <div className="classes.chartContainer">
              <GraphOption
                data={chartData}
                options={{
                  title: {
                    display: false
                  },
                  legend: {
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
                            if (selectedQueryTitle === 'avgRevenuePerGuest') {
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
          {selectedXAxisOption === 'month' || selectedXAxisOption === 'year' ? (
            <h5>Shown data starting from {startDate}</h5>
          ) : null}
        </Card>
      </div>
    )
  }
}

function formatQueryName(name) {
  if (name === 'avgRevenuePerGuest') {
    name = 'Average' + name.slice(3)
  }
  name = name.replace(/([A-Z])/g, ' $1')
  name = name[0].toUpperCase() + name.slice(1)

  return name
}
