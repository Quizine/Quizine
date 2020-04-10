import React, {Component} from 'react'
import WaiterPerformance from './StaffAnalyticsGraphs'

export default class StaffAnalyticsPage extends Component {
  render() {
    return (
      <div className="analytics-page-container">
        <div className="bus-charts-cont">
          <WaiterPerformance />
        </div>
      </div>
    )
  }
}
