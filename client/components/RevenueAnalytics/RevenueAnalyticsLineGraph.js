import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Line, Bar} from 'react-chartjs-2'
import clsx from 'clsx'
import {Card, CardHeader, CardContent, Divider} from '@material-ui/core'
import GraphOptionButtons from './GraphOptionButtons'

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
})

export default class RevenueAnalyticsLineGraph extends Component {
  render() {
    const lunchRevenue = this.props.revenueQueryResults.lunchRevenue
    const dinnerRevenue = this.props.revenueQueryResults.dinnerRevenue
    const xAxis = this.props.revenueQueryResults.xAxis
    const startDate = this.props.revenueQueryResults.startDate
    const selectedXAxisOption = this.props.selectedXAxisOption
    const selectedGraphOption = this.props.selectedGraphOption
    const handleGraphOptionChange = this.props.handleGraphOptionChange
    const selectedQueryTitle = this.props.selectedQueryTitle

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
          backgroundColor: '#E58A8A', //'rgba(255, 10, 13, 0.1)',
          borderColor: '#E58A8A',
          hoverBackgroundColor: '#D8345F',
          pointBackgroundColor: '#E58A8A',
          pointRadius: 2
        },
        {
          fill: false,
          label: 'Dinner Revenue: ' + formatter.format(dinnerRevenueTotal),
          data: dinnerRevenue,
          backgroundColor: '#588DA8',
          borderColor: '#588DA8',
          hoverBackgroundColor: '#1D3557',
          pointBackgroundColor: '#588DA8',
          pointRadius: 2
        }
      ]
    }
    const GraphOption = selectedGraphOption === 'line' ? Line : Bar
    if (!lunchRevenue) {
      return <div>...loading</div>
    }
    return (
      <div>
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
