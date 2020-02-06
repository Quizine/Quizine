import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getMenuSalesNumbersVsMenuItems} from '../../store/businessAnalyticsReducer'
import {Bar} from 'react-chartjs-2'

class MenuSalesNumbersVsMenuItems extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedOption: 'month'
    }
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    this.props.loadMenuSalesNumbersVsMenuItems(this.state.selectedOption)
  }

  handleChange(event) {
    this.setState({selectedOption: event.target.value})
    if (
      !Object.keys(this.props.menuSalesNumbersVsMenuItems[event.target.value])
        .length
    ) {
      this.props.loadMenuSalesNumbersVsMenuItems(event.target.value)
    }
  }

  render() {
    const labels = this.props.menuSalesNumbersVsMenuItems.xAxis
    const yAxis = this.props.menuSalesNumbersVsMenuItems.yAxis

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
    menuSalesNumbersVsMenuItems:
      state.businessAnalytics.menuSalesNumbersVsMenuItems
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadMenuSalesNumbersVsMenuItems(timeInterval) {
      dispatch(getMenuSalesNumbersVsMenuItems(timeInterval))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  MenuSalesNumbersVsMenuItems
)
