import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getMenuSalesNumbersChart} from '../../store/stockQueryReducer'
import {Bar} from 'react-chartjs-2'

class MenuSalesNumbersChart extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedOption: 'month'
    }
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    this.props.loadMenuSalesNumbersChart(this.state.selectedOption)
  }

  handleChange(event) {
    this.setState({selectedOption: event.target.value})
    if (
      !Object.keys(this.props.menuSalesNumbersChart[event.target.value]).length
    ) {
      this.props.loadMenuSalesNumbersChart(event.target.value)
    }
  }

  render() {
    const labels = this.props.menuSalesNumbersChart.xAxis
    const yAxis = this.props.menuSalesNumbersChart.yAxis

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Total # of Sales By Item',
          data: yAxis,
          backgroundColor: 'yellow'
        }
      ]
    }
    return (
      <div className="peak-time-div">
        <select onChange={this.handleChange}>
          <option value="month">Month</option>
          <option value="year">Year</option>
          <option value="week">Week</option>
        </select>
        <div>
          <Bar
            data={chartData}
            options={{
              title: {
                display: true,
                text: 'Total # of Sales By Item'
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
    menuSalesNumbersChart: state.stockQueries.menuSalesNumbersChart
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadMenuSalesNumbersChart(timeInterval) {
      dispatch(getMenuSalesNumbersChart(timeInterval))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  MenuSalesNumbersChart
)
