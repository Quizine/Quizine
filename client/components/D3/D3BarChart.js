import React, {Component} from 'react'
import barChartHelper from './helpers'

export class D3BarChart extends Component {
  componentDidMount() {
    barChartHelper(this.props.xData, this.props.yData)
  }
  componentDidUpdate(prevProps) {
    barChartHelper(this.props.xData, this.props.yData)
  }

  render() {
    return <div className="chart-div" />
  }
}

export default D3BarChart
