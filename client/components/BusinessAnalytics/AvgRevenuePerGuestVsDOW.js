import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getAvgRevenuePerGuestVsDOW} from '../../store/businessAnalyticsReducer'
import {Bar} from 'react-chartjs-2'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import {makeStyles} from '@material-ui/styles'
import DropdownComponent from './DropdownComponent'
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Button
} from '@material-ui/core'

class AvgRevenuePerGuestVsDOW extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedOption: 'month'
    }
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    this.props.loadAvgRevenuePerGuestVsDOW(this.state.selectedOption)
  }

  handleChange(event) {
    this.setState({selectedOption: event.target.value})
    if (
      !Object.keys(this.props.avgRevenuePerGuestVsDOW[event.target.value])
        .length
    ) {
      this.props.loadAvgRevenuePerGuestVsDOW(event.target.value)
    }
  }

  render() {
    const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat']
    const arrPerc = this.props.avgRevenuePerGuestVsDOW[
      this.state.selectedOption
    ]

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Average Revenue per Guest, $',
          data: arrPerc,
          backgroundColor: '#24497A'
        }
      ]
    }

    return (
      <div className="peak-time-div">
        <Card className={clsx('classes.root, className')}>
          <CardHeader
            action={
              <select onChange={this.handleChange} className="select-css">
                <option value="month">Month</option>
                <option value="year">Year</option>
                <option value="week">Week</option>
              </select>
              // <DropdownComponent handleChangeData={this.handleChange} />
            }
            title="Average Revenue per Guest"
          />
          <Divider />

          <CardContent>
            <div className="classes.chartContainer">
              <Bar
                data={chartData}
                options={{
                  title: {
                    display: false,
                    text: 'Average Revenue Per Guest'
                  },
                  scales: {
                    yAxes: [
                      {
                        ticks: {
                          suggestedMax: 75,
                          suggestedMin: 45
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

      // <div className="peak-time-div">
      //   <div className="chart-header">
      //     <select onChange={this.handleChange} defaultValue="month">
      //       <option value="year">Year</option>
      //       <option value="month">Month</option>
      //       <option value="week">Week</option>
      //     </select>
      //     <h3>Average Revenue Per Guest Per Day of Week</h3>
      //   </div>
      //   <div>
      //     <Bar
      //       data={chartData}
      //       options={{
      //         title: {
      //           display: false,
      //           text: 'Average Revenue Per Guest Per Day of Week'
      //         }
      //       }}
      //     />
      //   </div>
      // </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    avgRevenuePerGuestVsDOW: state.businessAnalytics.avgRevenuePerGuestVsDOW
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadAvgRevenuePerGuestVsDOW: timeInterval =>
      dispatch(getAvgRevenuePerGuestVsDOW(timeInterval))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  AvgRevenuePerGuestVsDOW
)
