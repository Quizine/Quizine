import React, {Component} from 'react'
import {connect} from 'react-redux'
import PeakTimeGraph from './PeakTimeGraph'
import StackedBarGraphRevenue from './StackedBarGraphRevenue'
import EnhancedTable from './DOWAnalysisTable'
import MenuSalesNumbersVsMenuItemsTopOrBottom5 from './MenuSalesNumbersVsMenuItemsTopOrBottom5'
import CalendarContainer from './Calendar/Calendar'
import {
  getDOWAnalysisTable,
  getRestaurantInfo,
  getRevenueVsTime,
  getNumberOfWaiters,
  getYelpRating
} from '../../store/summaryReducer'
import TotalRevenue from './TotalRevenueCard'
import NumberOfWaiters from './NumberOfWaitersCard'
import RestaurantInfo from './RestaurantInfoCard'
import YelpRating from './YelpRatingCard'
import {Grid, Divider} from '@material-ui/core'

class SummaryPage extends Component {
  constructor(props) {
    super(props)
    this.getTotalRevenue = this.getTotalRevenue.bind(this)
  }

  async componentDidMount() {
    this.props.loadDOWAnalysisTable()
    this.props.loadRevenueVsTime()
    this.props.loadNumberOfWaiters()
    await this.props.loadRestaurantInfo()
    this.props.loadYelpRating(
      this.props.restaurantInfo[0].restaurantName,
      this.props.restaurantInfo[0].location
    )
  }

  getTotalRevenue(arr) {
    return arr.reduce((acc, currentVal) => acc + currentVal.dayRevenue, 0)
  }

  render() {
    return (
      <div className="summary-page-container">
        {this.props.DOWAnalysisTable &&
        this.props.restaurantInfo[0] &&
        this.props.revenueVsTime.xAxis &&
        this.props.numberOfWaiters ? (
          <div className="card-container">
            <Grid container spacing={4}>
              <Grid item lg={3} sm={6} xl={3} xs={12}>
                <RestaurantInfo restaurantInfo={this.props.restaurantInfo[0]} />
              </Grid>
              <Grid item lg={3} sm={6} xl={3} xs={12}>
                <TotalRevenue
                  totalRevenue={
                    this.props.DOWAnalysisTable &&
                    this.getTotalRevenue(this.props.DOWAnalysisTable)
                  }
                />
              </Grid>
              <Grid item lg={3} sm={6} xl={3} xs={12}>
                <NumberOfWaiters numberOfWaiters={this.props.numberOfWaiters} />
              </Grid>
              <Grid item lg={3} sm={6} xl={3} xs={12}>
                <YelpRating yelpRating={this.props.yelpRating} />
              </Grid>
            </Grid>
          </div>
        ) : null}
        <Divider />
        <div>
          <CalendarContainer />
          <Divider />
        </div>
        <div className="summary-chart-container">
          <StackedBarGraphRevenue />
          <PeakTimeGraph />
          <MenuSalesNumbersVsMenuItemsTopOrBottom5 />
          <Divider />
        </div>
        <div className="summary-table-container">
          <EnhancedTable DOWAnalysisTable={this.props.DOWAnalysisTable} />
        </div>
      </div>
    )
  }
}

/**
 * CONTAINER
 */

const mapStateToProps = state => {
  const {
    DOWAnalysisTable,
    restaurantInfo,
    revenueVsTime,
    numberOfWaiters,
    yelpRating
  } = state.summary
  return {
    DOWAnalysisTable,
    restaurantInfo,
    revenueVsTime,
    numberOfWaiters,
    yelpRating
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadDOWAnalysisTable: () => dispatch(getDOWAnalysisTable()),
    loadRestaurantInfo: () => dispatch(getRestaurantInfo()),
    loadRevenueVsTime: () => dispatch(getRevenueVsTime()),
    loadNumberOfWaiters: () => dispatch(getNumberOfWaiters()),
    loadYelpRating: (restaurantName, location) =>
      dispatch(getYelpRating(restaurantName, location))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SummaryPage)
