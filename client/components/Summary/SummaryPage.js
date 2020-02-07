import React, {Component} from 'react'
import {connect} from 'react-redux'
import PeakTimeGraph from './PeakTimeGraph'
import LineGraphRevenue from './LineGraphRevenue'
import EnhancedTable from './DOWAnalysisTable'
import CalendarContainer from './Calendar/Calendar'
import {
  getDOWAnalysisTable,
  getRestaurantInfo,
  getRevenueVsTime,
  getNumberOfWaiters
} from '../../store/summaryReducer'
import TotalRevenue from './TotalRevenueCard'
import NumberOfWaiters from './NumberOfWaitersCard'
import RestaurantInfo from './RestaurantInfoCard'
import YelpRating from './YelpRatingCard'
import {Grid} from '@material-ui/core'

class SummaryPage extends Component {
  constructor(props) {
    super(props)
    this.getTotalRevenue = this.getTotalRevenue.bind(this)
  }

  componentDidMount() {
    this.props.loadDOWAnalysisTable()
    this.props.loadRestaurantInfo()
    this.props.loadRevenueVsTime()
    this.props.loadNumberOfWaiters()
  }

  getTotalRevenue(arr) {
    return (
      arr.reduce((acc, currentVal) => acc + currentVal, 0) / 1000
    ).toFixed(2)
  }

  render() {
    return (
      <div>
        {this.props.DOWAnalysisTable &&
        this.props.restaurantInfo[0] &&
        this.props.revenueVsTime.oneYear.revenue &&
        this.props.numberOfWaiters ? (
          <div className="card-container">
            <Grid container spacing={4}>
              <Grid item lg={3} sm={6} xl={3} xs={12}>
                <RestaurantInfo restaurantInfo={this.props.restaurantInfo[0]} />
              </Grid>
              <Grid item lg={3} sm={6} xl={3} xs={12}>
                <TotalRevenue
                  totalRevenue={this.getTotalRevenue(
                    this.props.revenueVsTime.oneYear.revenue
                  )}
                />
              </Grid>
              <Grid item lg={3} sm={6} xl={3} xs={12}>
                <NumberOfWaiters numberOfWaiters={this.props.numberOfWaiters} />
              </Grid>
              <Grid item lg={3} sm={6} xl={3} xs={12}>
                <YelpRating />
              </Grid>
            </Grid>
          </div>
        ) : null}
        <div>
          <CalendarContainer />
        </div>
        <div className="summary-chart-container">
          <LineGraphRevenue />
          <PeakTimeGraph />
        </div>
        <Grid item lg={4} md={6} xl={3} xs={12}>
          {/* <LatestProducts /> */}
        </Grid>
        <Grid item lg={8} md={12} xl={9} xs={12}>
          <EnhancedTable DOWAnalysisTable={this.props.DOWAnalysisTable} />
        </Grid>
      </div>
    )
  }
}

/**
 * CONTAINER
 */

const mapStateToProps = state => {
  return {
    DOWAnalysisTable: state.summary.DOWAnalysisTable,
    restaurantInfo: state.summary.restaurantInfo,
    revenueVsTime: state.summary.revenueVsTime,
    numberOfWaiters: state.summary.numberOfWaiters
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadDOWAnalysisTable: () => dispatch(getDOWAnalysisTable()),
    loadRestaurantInfo: () => dispatch(getRestaurantInfo()),
    loadRevenueVsTime: () => dispatch(getRevenueVsTime('oneYear')),
    loadNumberOfWaiters: () => dispatch(getNumberOfWaiters())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SummaryPage)
