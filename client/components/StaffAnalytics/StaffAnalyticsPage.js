import React, {Component} from 'react'
import WaiterPerformance from './WaiterPerformance'

export default class StaffAnalyticsPage extends Component {
  render() {
    return (
      <div>
        <div className="bus-charts-cont">
          <WaiterPerformance />
        </div>
      </div>
    )
  }
}
