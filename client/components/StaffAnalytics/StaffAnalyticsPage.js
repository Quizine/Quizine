import React, {Component} from 'react'
import WaiterPerformance from './StaffAnalyticsGraphs'

export default class StaffAnalyticsPage extends Component {
  render() {
    return (
      <div className="analytics-page-container">
        <WaiterPerformance />
      </div>
    )
  }
}
