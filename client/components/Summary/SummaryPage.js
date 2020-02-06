import React, {Component} from 'react'
import PeakTimeGraph from './PeakTimeGraph'
import LineGraphRevenue from './LineGraphRevenue'
import NumberOfWaiters from './NumberOfWaiters'

export class Summary extends Component {
  render() {
    return (
      <div className="summary-cont">
        <h2>BUSINESS SUMMARY</h2>
        <div className="summary-data">
          <PeakTimeGraph />
          <NumberOfWaiters />
          <LineGraphRevenue />
        </div>
      </div>
    )
  }
}

export default Summary
