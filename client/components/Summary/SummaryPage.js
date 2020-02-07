import React, {Component} from 'react'
import {connect} from 'react-redux'
import PeakTimeGraph from './PeakTimeGraph'
import LineGraphRevenue from './LineGraphRevenue'
import EnhancedTable from './DOWAnalysisTable'
import CalendarContainer from './Calendar/Calendar'
import {
  getDOWAnalysisTable,
  getRestaurantInfo
} from '../../store/summaryReducer'
import TotalRevenue from './TotalRevenue'
import NumberOfWaiters from './NumberOfWaiters'
import RestaurantInfo from './RestaurantInfo'
import {makeStyles} from '@material-ui/styles'
import {Grid} from '@material-ui/core'

// const useStyles = makeStyles(theme => ({
//   root: {
//     padding: theme.spacing(4)
//   }
// }));

class SummaryPage extends Component {
  componentDidMount() {
    this.props.loadDOWAnalysisTable()
    this.props.loadRestaurantInfo()
  }
  render() {
    // const classes = useStyles();
    return (
      <div>
        <div>{/* <CalendarContainer /> */}</div>
        {this.props.DOWAnalysisTable && this.props.restaurantInfo[0] ? (
          <div className="{padding: theme.spacing(4)}">
            <Grid container spacing={4}>
              <Grid item lg={3} sm={6} xl={3} xs={12}>
                <RestaurantInfo />
              </Grid>
              <Grid item lg={3} sm={6} xl={3} xs={12}>
                <TotalRevenue />
              </Grid>
              <Grid item lg={3} sm={6} xl={3} xs={12}>
                <NumberOfWaiters />
              </Grid>
              <Grid item lg={3} sm={6} xl={3} xs={12}>
                {/* <TotalProfit /> */}
              </Grid>
              <Grid item lg={8} md={12} xl={9} xs={12}>
                <LineGraphRevenue />
              </Grid>
              <Grid item lg={4} md={6} xl={3} xs={12}>
                <PeakTimeGraph />
              </Grid>
              <Grid item lg={4} md={6} xl={3} xs={12}>
                {/* <LatestProducts /> */}
              </Grid>
              <Grid item lg={8} md={12} xl={9} xs={12}>
                <EnhancedTable DOWAnalysisTable={this.props.DOWAnalysisTable} />
              </Grid>
            </Grid>
          </div>
        ) : // <div className="summary-cont">
        /* <h2>BUSINESS SUMMARY</h2>
            <h3>{this.props.restaurantInfo[0].restaurantName}</h3>
            <h3>{this.props.restaurantInfo[0].location}</h3> */
        //       <div className="summary-data">

        //       </div>
        //       <div>

        //       </div>
        //     </div>
        null}
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
    restaurantInfo: state.summary.restaurantInfo
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadDOWAnalysisTable: () => dispatch(getDOWAnalysisTable()),
    loadRestaurantInfo: () => dispatch(getRestaurantInfo())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SummaryPage)
