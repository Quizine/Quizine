import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getAvgRevPerGuest} from '../../store/stockQueryReducer'
import {Bar} from 'react-chartjs-2'

class AvgRevPerGuest extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedOption: 'month'
    }
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    this.props.loadAvgRevPerGuest(this.state.selectedOption)
  }

  handleChange(event) {
    this.setState({selectedOption: event.target.value})
    if (!Object.keys(this.props.avgRevPerGuest[event.target.value]).length) {
      this.props.loadAvgRevPerGuest(event.target.value)
    }
  }

  render() {
    const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat']
    const arrPerc = this.props.avgRevPerGuest[this.state.selectedOption]

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Average Revenue per Guest, $',
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
                text: 'Average Revenue Per Guest Per Day of Week'
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
    avgRevPerGuest: state.stockQueries.avgRevPerGuest
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadAvgRevPerGuest: timeInterval =>
      dispatch(getAvgRevPerGuest(timeInterval))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AvgRevPerGuest)
