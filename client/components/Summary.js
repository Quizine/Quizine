import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import PeakTimeGraph from './charts/PeakTimeGraph'
import {getSummary} from '../store/summaryReducer'

export class Summary extends Component {
  componentDidMount() {
    this.props.getSummary()
  }

  render() {
    console.log(this.props.summary)
    return (
      <div>
        <h2>Welcome, !</h2>
        <p>Quick summary:</p>
        <Link to="/newquery">
          <button type="submit">New Query</button>
        </Link>
        <PeakTimeGraph />
      </div>
    )
  }
}

/**
 * CONTAINER
 */

const mapState = state => {
  return {
    summary: state.summary.summary
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getSummary: () => dispatch(getSummary())
  }
}

export default connect(mapState, mapDispatchToProps)(Summary)
