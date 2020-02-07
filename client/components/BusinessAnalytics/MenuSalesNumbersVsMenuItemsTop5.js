import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getMenuSalesNumbersVsMenuItemsTop5} from '../../store/businessAnalyticsReducer'
import {Pie} from 'react-chartjs-2'

class MenuSalesNumbersVsMenuItemsTop5 extends Component {
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
      !Object.keys(
        this.props.menuSalesNumbersVsMenuItemsTop5[event.target.value]
      ).length
    ) {
      this.props.loadMenuSalesNumbersVsMenuItems(event.target.value)
    }
  }

  render() {
    const labels = this.props.menuSalesNumbersVsMenuItemsTop5.xAxis
    const yAxis = this.props.menuSalesNumbersVsMenuItemsTop5.yAxis

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Top 5 Menu Items',
          data: yAxis,
          backgroundColor: randomColor(yAxis.length)
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
          <Pie
            data={chartData}
            options={{
              title: {
                display: true,
                text: 'Top 5 Menu Items'
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
    menuSalesNumbersVsMenuItemsTop5:
      state.businessAnalytics.menuSalesNumbersVsMenuItemsTop5
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadMenuSalesNumbersVsMenuItems(timeInterval) {
      dispatch(getMenuSalesNumbersVsMenuItemsTop5(timeInterval))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  MenuSalesNumbersVsMenuItemsTop5
)

//RANDOM COLOR GENERATOR, takes the length of an array
function randomColor(length) {
  let colorArray = [
    '#FF6633',
    '#FFB399',
    '#FF33FF',
    '#FFFF99',
    '#00B3E6',
    '#E6B333',
    '#3366E6',
    '#999966',
    '#99FF99',
    '#B34D4D',
    '#80B300',
    '#809900',
    '#E6B3B3',
    '#6680B3',
    '#66991A',
    '#FF99E6',
    '#CCFF1A',
    '#FF1A66',
    '#E6331A',
    '#33FFCC',
    '#66994D',
    '#B366CC',
    '#4D8000',
    '#B33300',
    '#CC80CC',
    '#66664D',
    '#991AFF',
    '#E666FF',
    '#4DB3FF',
    '#1AB399',
    '#E666B3',
    '#33991A',
    '#CC9999',
    '#B3B31A',
    '#00E680',
    '#4D8066',
    '#809980',
    '#E6FF80',
    '#1AFF33',
    '#999933',
    '#FF3380',
    '#CCCC00',
    '#66E64D',
    '#4D80CC',
    '#9900B3',
    '#E64D66',
    '#4DB380',
    '#FF4D4D',
    '#99E6E6',
    '#6666FF'
  ]
  let newArr = []
  for (let i = 0; i < length; i++) {
    newArr.push(colorArray[i])
  }
  return newArr
}
