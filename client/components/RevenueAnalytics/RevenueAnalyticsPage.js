import React, {Component} from 'react'
import AvgRevenuePerGuestVsDOW from './AvgRevenuePerGuestVsDOW'
import LineGraphMonthlyRevenueVsLunchVsDinner from './MonthlyRevenueVsLunchVsDinner'

export default class RevenuePage extends Component {
  render() {
    return (
      <div>
        <div className="bus-charts-cont">
          <AvgRevenuePerGuestVsDOW />
          <LineGraphMonthlyRevenueVsLunchVsDinner />
        </div>
      </div>
    )
  }
}
