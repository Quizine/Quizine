import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import AvgRevenuePerGuestVsDOW from './AvgRevenuePerGuestVsDOW'
import MenuSalesNumbersVsMenuItemsTopOrBottom5 from './MenuSalesNumbersVsMenuItemsTopOrBottom5'
import NumberOfOrdersVsHour from './NumberOfOrdersVsHour'
import TipPercentageVsWaiters from './TipPercentageVsWaiters'
import AvgNumberOfGuestsVsWaitersPerOrder from './AvgNumberOfGuestsVsWaitersPerOrder'

export default class BusinessAnalyticsPage extends Component {
  render() {
    return (
      <div>
        <div>
          <h2>Welcome, !</h2>
          <p>Quick business analytics:</p>
          <AvgRevenuePerGuestVsDOW />
          <MenuSalesNumbersVsMenuItemsTopOrBottom5 />
          <NumberOfOrdersVsHour />
          <TipPercentageVsWaiters />
          <AvgNumberOfGuestsVsWaitersPerOrder />
          <Link to="/newquery">
            <button type="submit">NEW QUERY</button>
          </Link>
        </div>
      </div>
    )
  }
}
