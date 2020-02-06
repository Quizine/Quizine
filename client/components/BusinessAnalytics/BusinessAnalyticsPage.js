import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import AvgRevenuePerGuestVsDOW from './AvgRevenuePerGuestVsDOW'
import MenuSalesNumbersVsMenuItems from './MenuSalesNumbersVsMenuItems'
import NumberOfOrdersVsHour from './NumberOfOrdersVsHour'
import TipPercentageVsWaiters from './TipPercentageVsWaiters'
import AvgNumberOfGuestsVsWaiters from './AvgNumberOfGuestsVsWaiters'

export default class BusinessAnalyticsPage extends Component {
  render() {
    return (
      <div>
        <div>
          <h2>Welcome, !</h2>
          <p>Quick business analytics:</p>
          <AvgRevenuePerGuestVsDOW />
          <MenuSalesNumbersVsMenuItems />
          <NumberOfOrdersVsHour />
          <TipPercentageVsWaiters />
          <AvgNumberOfGuestsVsWaiters />
          <Link to="/newquery">
            <button type="submit">NEW QUERY</button>
          </Link>
        </div>
      </div>
    )
  }
}
