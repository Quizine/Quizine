import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import AvgRevenuePerGuestVsDOW from './AvgRevenuePerGuestVsDOW'
import MenuSalesNumbersVsMenuItemsTop5 from './MenuSalesNumbersVsMenuItemsTop5'
import MenuSalesNumbersVsMenuItemsBottom5 from './MenuSalesNumbersVsMenuItemsBottom5'
import NumberOfOrdersVsHour from './NumberOfOrdersVsHour'
import TipPercentageVsWaiters from './TipPercentageVsWaiters'
import AvgNumberOfGuestsVsWaitersPerOrder from './AvgNumberOfGuestsVsWaitersPerOrder'

export default class BusinessAnalyticsPage extends Component {
  render() {
    return (
      <div>
        <div>
          <AvgRevenuePerGuestVsDOW />
          <MenuSalesNumbersVsMenuItemsTop5 />
          <MenuSalesNumbersVsMenuItemsBottom5 />
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
