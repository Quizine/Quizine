import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {getStockQueryResults} from '../store/stockQueryReducer'

export class StockQueryAnalytics extends Component {
  componentDidMount() {
    this.props.loadStockQueryResults()
  }

  render() {
    const stockQueries = this.props.stockQueries
    return (
      <div>
        {stockQueries ? (
          <div>
            <h2>Welcome, !</h2>
            <p>Quick summary:</p>
            <Link to="/newquery">
              <button type="submit">NEW QUERY</button>
            </Link>
          </div>
        ) : null}
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
