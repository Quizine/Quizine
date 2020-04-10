import React, {Component} from 'react'
import AvgRevenuePerGuestVsDOW from './RevenueAnalyticsGraphs'

export default class RevenuePage extends Component {
  render() {
    return (
      <div>
        <div className="bus-charts-cont">
          <AvgRevenuePerGuestVsDOW />
        </div>
      </div>
    )
  }
}
