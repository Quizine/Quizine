import React, {Component} from 'react'
import RevenueAnalyticsGraphs from './RevenueAnalyticsGraphs'

export default class RevenuePage extends Component {
  render() {
    return (
      <div className="analytics-page-container">
        <div className="bus-charts-cont">
          <RevenueAnalyticsGraphs />
        </div>
      </div>
    )
  }
}
