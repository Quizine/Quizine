import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getNumOrdersPerHour} from '../../store/stockQueryReducer'
import {Bar} from 'react-chartjs-2'

class NumOrdersPerHourChart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedOption: 'month'
    }
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    this.props.loadNumOfOrdersPerHour(this.state.selectedOption)
  }

  handleChange(event) {
    this.setState({selectedOption: event.target.value})
    if (!Object.keys(this.props.numOrdersPerHour[event.target.value]).length) {
      this.props.loadNumOfOrdersPerHour(event.target.value)
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
      '9pm',
      '10pm'
    ]
    const arrPerc = this.props.numOrdersPerHour[this.state.selectedOption]

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Number of Orders',
          data: arrPerc,
          backgroundColor: 'yellow'
        }
      ]
    }

    return (
      <div className="peak-time-div">
        <select onChange={this.handleChange}>
          <option value="year">Year</option>
          <option value="month" selected>
            Month
          </option>
          <option value="week">Week</option>
        </select>
        <div>
          <Bar
            data={chartData}
            options={{
              title: {
                display: true,
                text: 'Number of Orders Per Hour'
              }
            }}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    numOrdersPerHour: state.stockQueries.numOrdersPerHour
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadNumOfOrdersPerHour: timeInterval =>
      dispatch(getNumOrdersPerHour(timeInterval))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  NumOrdersPerHourChart
)
