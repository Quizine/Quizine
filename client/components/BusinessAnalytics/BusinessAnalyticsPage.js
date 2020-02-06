import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {getStockQueryResults} from '../store/stockQueryReducer'
import WaitersTipPercent from './charts/WaitersTipPercent'
import MenuSalesNumbersChart from './charts/MenuSalesNumbers'
export class StockQueryAnalytics extends Component {
  componentDidMount() {
    this.props.loadStockQueryResults()
  }

  render() {
    return (
      <div>
        <div>
          <h2>Welcome, !</h2>
          <p>Quick business analytics:</p>
          <WaitersTipPercent />
          <MenuSalesNumbersChart />
          <Link to="/newquery">
            <button type="submit">NEW QUERY</button>
          </Link>
        </div>
      </div>
    )
  }
}

/**
 * CONTAINER
 */

const mapState = state => {
  return {
    stockQueries: state.stockQueries.stockQueries
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadStockQueryResults: () => dispatch(getStockQueryResults())
  }
}

export default connect(mapState, mapDispatchToProps)(StockQueryAnalytics)
