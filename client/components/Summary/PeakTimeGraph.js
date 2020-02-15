import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getPeakTimeOrders} from '../../store/summaryReducer'
import {Bar} from 'react-chartjs-2'
import clsx from 'clsx'
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Button
} from '@material-ui/core'

class PeakTimeGraph extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedOption: 'year'
    }
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    this.props.loadPeakTimeOrders(this.state.selectedOption)
  }

  handleChange(event) {
    this.setState({selectedOption: event.target.value})
    if (!Object.keys(this.props.peakTimeOrders[event.target.value]).length) {
      this.props.loadPeakTimeOrders(event.target.value)
    }
  }

  render() {
    const labels = [
      '11am',
      '12pm',
      '1pm',
      '2pm',
      '3pm',
      '4pm',
      '5pm',
      '6pm',
      '7pm',
      '8pm',
      '9pm'
      // '10pm' NO ORDERS AT 10PM IN CURRENT DB
    ]
    const arrPerc = this.props.peakTimeOrders[this.state.selectedOption]

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Percentage',
          data: arrPerc,
          backgroundColor: 'yellow'
        }
      ]
    }
    return (
      <div className="peak-time-div">
        <Card className={clsx('classes.root, className')}>
          <CardHeader
            action={
              <select onChange={this.handleChange} className="select-css">
                <option value="year">Year</option>
                <option value="month">Month</option>
                <option value="week">Week</option>
              </select>
            }
            title="Guest Distribution per Hour (%)"
          />
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
  return {
    peakTimeOrders: state.summary.peakTimeOrdersVsTime
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadPeakTimeOrders: timeInterval =>
      dispatch(getPeakTimeOrders(timeInterval))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PeakTimeGraph)
