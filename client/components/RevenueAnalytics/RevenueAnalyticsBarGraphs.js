import React, {Component} from 'react'
import {Line, Bar} from 'react-chartjs-2'
import clsx from 'clsx'
import {Card, CardHeader, CardContent, Divider} from '@material-ui/core'
import GraphOptionButtons from './GraphOptionButtons'
import AggOptions from './AggOptions'
import {CSVLink} from 'react-csv'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
})

const numberFormatter = new Intl.NumberFormat('en-US')

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
    const selectedAggOption = this.props.selectedAggOption
    const handleAggOptionChange = this.props.handleAggOptionChange

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
            selectedQueryTitle === 'numberOfOrders' ? '#BB3B0E' : '#024249',
          pointBackgroundColor:
            selectedQueryTitle === 'numberOfOrders' ? '#F79071' : '#16817A',
          pointRadius: 2
        }
      ]
    }
    const aggValue =
      yAxis && aggValueFormatting(selectedAggOption, selectedQueryTitle, yAxis)

    const queryData = chartData.datasets[0].data
    const GraphOption = selectedGraphOption === 'line' ? Line : Bar
    if (!queryData) {
      return <h6>loading...</h6>
    }
    return (
      <div className="peak-time-div">
        <Card className={clsx('classes.root, className')}>
          <CardHeader title={formatQueryName(selectedQueryTitle)} />
          <AggOptions
            selectedAggOption={selectedAggOption}
            selectedQueryTitle={selectedQueryTitle}
            handleAggOptionChange={handleAggOptionChange}
          />
          <GraphOptionButtons
            handleGraphOptionChange={handleGraphOptionChange}
            selectedQueryTitle={selectedQueryTitle}
            selectedGraphOption={selectedGraphOption}
          />
          <Divider />
          <h5>{aggValue}</h5>
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
                              return currencyFormatter.format(value)
                            }
                            return numberFormatter.format(value)
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
        <button type="button" className="download-btn">
          <CSVLink
            data={tableDataFormatting(
              selectedXAxisOption,
              selectedAggOption,
              selectedQueryTitle,
              labels,
              yAxis
            )}
          >
            Download CSV
          </CSVLink>
        </button>
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

function tableDataFormatting(nameXAxis, aggOption, queryTitle, xAxis, yAxis) {
  const nameYAxis = graphTitleFormatting(aggOption, queryTitle)
  let result = [[nameXAxis, nameYAxis]]
  for (let i = 0; i < xAxis.length; i++) {
    result.push([xAxis[i], yAxis[i]])
  }
  return result
}

// eslint-disable-next-line complexity
function graphTitleFormatting(aggOption, queryTitle) {
  let graphTitle
  if (queryTitle === 'avgRevenuePerGuest') {
    if (aggOption === 'sum') {
      graphTitle = 'Total Revenue'
    } else if (aggOption === 'avg') {
      graphTitle = 'Average Renevue Per Table Served'
    } else if (aggOption === 'avgRevenuePerGuest') {
      graphTitle = 'Average Revenue Per Guest'
    }
  } else if (queryTitle === 'numberOfOrders') {
    if (aggOption === 'sum') {
      graphTitle = 'Total Number of Menu Items'
    } else if (aggOption === 'avg') {
      graphTitle = 'Average Number of Menu Items Per Table Served'
    } else if (aggOption === 'numberOfOrders') {
      graphTitle = 'Total Number of Tables Served'
    }
  }
  return graphTitle
}

function aggValueFormatting(aggOption, queryTitle, yAxis) {
  let aggValue
  let sumYAxis = yAxis.reduce((acc, curr) => acc + curr)
  if (queryTitle === 'avgRevenuePerGuest' && aggOption === 'sum') {
    aggValue = currencyFormatter.format(sumYAxis)
  } else if (queryTitle === 'avgRevenuePerGuest' && aggOption !== 'sum') {
    aggValue = currencyFormatter.format(sumYAxis / yAxis.length)
  } else if (queryTitle === 'numberOfOrders' && aggOption !== 'avg') {
    aggValue = numberFormatter.format(sumYAxis)
  } else {
    aggValue = numberFormatter.format((sumYAxis / yAxis.length).toFixed(2))
  }
  return aggValue
}
