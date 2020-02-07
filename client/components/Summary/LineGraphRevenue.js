import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Line} from 'react-chartjs-2'
import {getRevenueVsTime} from '../../store/summaryReducer'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import {makeStyles} from '@material-ui/styles'
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Button
} from '@material-ui/core'

class LineGraphRevenue extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedOption: 'oneYear'
    }
    this.handleChange = this.handleChange.bind(this)
    this.getTotalRevenue = this.getTotalRevenue.bind(this)
  }

  componentDidMount() {
    this.props.loadRevenueVsTime(this.state.selectedOption)
  }

  handleChange(event) {
    this.setState({selectedOption: event.target.value})
    if (!Object.keys(this.props.lineChartData[event.target.value]).length) {
      this.props.loadRevenueVsTime(event.target.value)
    }
  }
  getTotalRevenue(arr) {
    return arr.reduce((acc, currentVal) => acc + currentVal, 0)
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
    return (
      <div>
        {revenue ? (
          <div className="rev-time-div">
            <p>{this.getTotalRevenue(revenue).toFixed(0)}</p>
            <div />
            <Card
              // {...rest}
              className={clsx('classes.root, className')}
            >
              <CardHeader
                action={
                  // <Button
                  //   size="small"
                  //   variant="text"
                  // >
                  //   Last 7 days <ArrowDropDownIcon />
                  // </Button>
                  <select onChange={this.handleChange}>
                    <option value="oneYear">Last Year</option>
                    <option value="twoYears">Last 2 Years</option>
                    <option value="allPeriod">All History</option>
                  </select>
                }
                title="Peak Time"
              />
              <Divider />
              <CardContent>
                <div className="classes.chartContainer">
                  <Line
                    data={chartData}
                    options={{
                      title: {
                        display: true,
                        text: 'REVENUE vs TIME'
                      }
                    }}
                  />
                </div>
              </CardContent>
              <Divider />
              <CardActions className="classes.actions">
                <Button color="primary" size="small" variant="text">
                  {/* Overview <ArrowRightIcon /> */}
                </Button>
              </CardActions>
            </Card>
          </div>
        ) : null}
      </div>
    )
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
