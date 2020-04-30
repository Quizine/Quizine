import React, {Component} from 'react'
import {Line, Bar} from 'react-chartjs-2'
import clsx from 'clsx'
import {Card, CardHeader, CardContent, Divider} from '@material-ui/core'
import GraphOptionButtons from './GraphOptionButtons'
import {CSVLink} from 'react-csv'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
})

export default class RevenueAnalyticsLineGraph extends Component {
  // eslint-disable-next-line complexity
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

    const revenueTotal = currencyFormatter.format(
      lunchRevenueTotal + dinnerRevenueTotal
    )

    const chartData = {
      labels: xAxis,
      datasets: [
        {
          fill: false,
          label: 'Lunch Revenue', //+ currencyFormatter.format(lunchRevenueTotal),
          data: lunchRevenue,
          backgroundColor: '#E58A8A',
          borderColor: '#E58A8A',
          hoverBackgroundColor: '#D8345F',
          pointBackgroundColor: '#E58A8A',
          pointRadius: 2
        },
        {
          fill: false,
          label: 'Dinner Revenue', //+ currencyFormatter.format(dinnerRevenueTotal),
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

    console.log(
      'DATA: ',
      'XAXIS Option-> ',
      selectedXAxisOption,
      'X-Axis -> ',
      xAxis,
      'Lunch -> ',
      lunchRevenue,
      'dinner -> ',
      dinnerRevenue
    )
    if (!lunchRevenue) {
      return <div>...loading</div>
    }
    return (
      <div>
        <div className="peak-time-div">
          <Card className={clsx('classes.root, className')}>
            <CardHeader title={formatQueryName(selectedQueryTitle)} />
            <h4>Revenue Total: {revenueTotal}</h4>
            <h4>
              Lunch Revenue Total: {currencyFormatter.format(lunchRevenueTotal)}
            </h4>
            <h4>
              Dinner Revenue Total:{' '}
              {currencyFormatter.format(dinnerRevenueTotal)}
            </h4>
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
                      xAxes: [
                        {
                          stacked: selectedGraphOption === 'stacked bar'
                        }
                      ],
                      yAxes: [
                        {
                          display: true,
                          stacked: selectedGraphOption === 'stacked bar',
                          ticks: {
                            suggestedMin: 0,
                            suggestedMax:
                              Math.max(...lunchRevenue, ...dinnerRevenue) * 1.1,
                            callback: function(value) {
                              return currencyFormatter
                                .format(value)
                                .slice(0, -3)
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
          <button type="button" className="download-btn">
            <CSVLink
              data={tableDataFormatting(
                selectedXAxisOption,
                xAxis,
                lunchRevenue,
                dinnerRevenue
              )}
            >
              Download CSV
            </CSVLink>
          </button>
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

function tableDataFormatting(nameXAxis, xAxis, yAxis1, yAxis2) {
  let result = [[nameXAxis, 'Lunch Revenue ($)', 'Dinner Revenue ($)']]
  for (let i = 0; i < xAxis.length; i++) {
    result.push([xAxis[i], yAxis1[i], yAxis2[i]])
  }
  return result
}
