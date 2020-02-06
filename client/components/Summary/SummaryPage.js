import React, {Component} from 'react'
import {connect} from 'react-redux'
import PeakTimeGraph from './PeakTimeGraph'
import LineGraphRevenue from './LineGraphRevenue'
import {getSummary} from '../../store/summaryReducer'

export class Summary extends Component {
  render() {
    console.log(this.props.summary) // ???????
    return (
      <div className="summary-cont">
        <h2>BUSINESS SUMMARY</h2>
        <div className="summary-data">
          <PeakTimeGraph />
          <LineGraphRevenue />
        </div>
      </div>
    )
  }
}

/**
 * CONTAINER
 */
//test
const mapState = state => {
  return {
    summary: state.summary.summary // ???????
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getSummary: () => dispatch(getSummary())
  }
}

export default connect(mapState, mapDispatchToProps)(Summary)
