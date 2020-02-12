import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Line} from 'react-chartjs-2'
import {getRevenueVsTime} from '../../store/summaryReducer'
import clsx from 'clsx'
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Button
} from '@material-ui/core'

//UTILITY FUNCTIONS:
Array.prototype.max = function() {
  return Math.max.apply(null, this)
}

Array.prototype.min = function() {
  return Math.min.apply(null, this)
}

class LineGraphRevenue extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedOption: 'allPeriod'
    }
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    this.props.loadRevenueVsTime(this.state.selectedOption)
  }

  handleChange(event) {
    event.preventDefault()
    this.setState({selectedOption: event.target.value})
    if (!Object.keys(this.props.lineChartData[event.target.value]).length) {
      this.props.loadRevenueVsTime(event.target.value)
    }
  }

  render() {
    const {month, revenue} = this.props.lineChartData[this.state.selectedOption]
    const chartData = {
      labels: month,
      datasets: [
        {
          label: 'REVENUE',
          data: revenue,
          backgroundColor: 'lightgreen',
          borderColor: 'yellow',
          hoverBackgroundColor: 'red',
          pointBackgroundColor: 'black',
          pointRadius: 4
        }
      ]
    }

    if (revenue) {
      return (
        <div>
          <div className="peak-time-div">
            <Card className={clsx('classes.root, className')}>
              <CardHeader
                action={
                  <select onChange={this.handleChange} className="select-css">
                    <option value="allPeriod">All History</option>
                    <option value="oneYear">Last Year</option>
                    <option value="twoYears">Last 2 Years</option>
                  </select>
                }
                title="Revenue per Month ($)"
              />
              <Divider />
              <CardContent>
                <div className="classes.chartContainer">
                  <Line
                    data={chartData}
                    options={{
                      //                       title: {
                      //                         display: true,
                      //                         text: 'REVENUE vs TIME'
                      //                       },
                      scales: {
                        yAxes: [
                          {
                            display: true,
                            ticks: {
                              suggestedMin: 500, //revenue.min(),
                              suggestedMax: 1000 //revenue.max()
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
        </div>
      )
    } else {
      return <h6>loading</h6>
    }
  }
}

const mapStateToProps = state => {
  return {lineChartData: state.summary.revenueVsTime}
}

const mapDispatchToProps = dispatch => {
  return {
    loadRevenueVsTime: timeInterval => dispatch(getRevenueVsTime(timeInterval))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LineGraphRevenue)
