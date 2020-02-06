import React, {Component} from 'react'
import {connect} from 'react-redux'
import PeakTimeGraph from './PeakTimeGraph'
import LineGraphRevenue from './LineGraphRevenue'
import EnhancedTable from './DOWAnalysisTable'
import {getDOWAnalysisTable} from '../../store/summaryReducer'

class SummaryPage extends Component {
  componentDidMount() {
    this.props.loadDOWAnalysisTable()
  }
  render() {
    return (
      <div className="summary-cont">
        <h2>BUSINESS SUMMARY</h2>
        <div className="summary-data">
          <PeakTimeGraph />
          <LineGraphRevenue />
        </div>
        <div>
          <EnhancedTable />
        </div>
      </div>
    )
  }
}

/**
 * CONTAINER
 */

const mapStateToProps = state => {
  return {
    DOWAnalysisTable: state.summary.DOWAnalysisTable
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadDOWAnalysisTable: () => dispatch(getDOWAnalysisTable())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SummaryPage)
