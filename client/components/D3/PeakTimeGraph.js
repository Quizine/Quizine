import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getPeakTimeOrders} from '../../store/peakTimeOrderReducer'
import {Bar} from 'react-chartjs-2'

class PeakTimeGraph extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedOption: 'year'
    }
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    this.props.loadPeakTimeOrders()
  }

  handleChange(e) {
    this.setState({selectedOption: e.target.value})
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
        <select onChange={this.handleChange}>
          <option value="year">Year</option>
          <option value="month">Month</option>
          <option value="week">Week</option>
        </select>
        <div>
          <Bar
            data={chartData}
            options={{
              title: {
                display: true,
                text: 'Peak Times'
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
    peakTimeOrders: state.peakTimeOrders
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadPeakTimeOrders: () => dispatch(getPeakTimeOrders())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PeakTimeGraph)
