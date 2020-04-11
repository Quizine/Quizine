import React, {Component} from 'react'
import {connect} from 'react-redux'
import {
  getRevenueQueryResultsDate,
  getRevenueQueryResultsInterval
} from '../../store/revenueAnalyticsReducer'
import RevenueAnalyticsBarGraphs from './RevenueAnalyticsBarGraphs'

class RevenueAnalyticsGraphs extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedOption: '30',
      queryTitleOptions: [
        'avgRevenuePerGuestVsDOW',
        'numberOfOrdersVsHour',
        'monthlyRevenueVsLunchVsDinner'
      ],
      selectedQueryTitle: 'avgRevenuePerGuestVsDOW',
      startDate: null,
      endDate: null,
      focusedInput: null
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSelectedQueryChange = this.handleSelectedQueryChange.bind(this)
  }

  componentDidMount() {
    this.props.loadRevenueQueryResultsInterval(
      this.state.selectedOption,
      this.state.selectedQueryTitle
    )
  }

  async handleChange(event) {
    await this.setState({selectedOption: event.target.value})
    this.props.loadRevenueQueryResultsInterval(
      this.state.selectedOption,
      this.state.selectedQueryTitle
    )
  }

  async handleSelectedQueryChange(event) {
    let formattedSelectedOptionNames
    await this.setState({
      selectedQueryTitle: event.target.value
    })

    // if (
    //   this.state.selectedOptionNames &&
    //   this.state.selectedOptionNames.length
    // ) {
    //   formattedSelectedOptionNames = this.state.selectedOptionNames.map(
    //     name => {
    //       return name.value
    //     }
    //   )
    // } else {
    //   formattedSelectedOptionNames = []
    // }
    if (this.state.selectedOption !== 'custom') {
      this.props.loadRevenueQueryResultsInterval(
        this.state.selectedOption,
        this.state.selectedQueryTitle
      )
    }
    // } else if (this.state.startDate && this.state.endDate) {
    //   const formattedStartDate =
    //     this.state.startDate.format('YYYY-MM-DD') + ' 00:00:00'
    //   const formattedEndDate =
    //     this.state.endDate.format('YYYY-MM-DD') + ' 23:59:59'
    //   this.props.loadWaiterPerformanceQueryResultsDate(
    //     formattedStartDate,
    //     formattedEndDate,
    //     this.state.selectedQueryTitle,
    //     formattedSelectedOptionNames
    //   )
    // }
  }

  render() {
    console.log('STATE', this.state)
    return (
      <div>
        <div>
          <select
            className="select-cust"
            onChange={this.handleSelectedQueryChange}
          >
            {this.state.queryTitleOptions.map((query, idx) => {
              return (
                <option key={idx} value={query}>
                  {formatQueryName(query)}
                </option>
              )
            })}
          </select>
        </div>
        {this.state.selectedQueryTitle !== 'monthlyRevenueVsLunchVsDinner' ? (
          <div>
            <div className="month-button">
              <select
                onChange={this.handleChange}
                className="select-cust"
                defaultValue="30"
              >
                <option value="365">Last 365 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="7">Last 7 Days</option>
                <option value="custom">Custom Dates</option>
              </select>
            </div>
            <RevenueAnalyticsBarGraphs
              selectedQueryTitle={this.state.selectedQueryTitle}
              revenueQueryResults={this.props.revenueQueryResults}
            />
          </div>
        ) : null}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    revenueQueryResults: state.revenueAnalytics.revenueQueryResults
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadRevenueQueryResultsInterval: (timeInterval, queryTitle) =>
      dispatch(getRevenueQueryResultsInterval(timeInterval, queryTitle)),
    loadRevenueQueryResultsDate: (startDate, endDate, queryTitle) =>
      dispatch(getRevenueQueryResultsDate(startDate, endDate, queryTitle))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  RevenueAnalyticsGraphs
)

function formatQueryName(name) {
  name = name.replace(/([A-Z])/g, ' $1')
  name = name[0].toUpperCase() + name.slice(1)
  return name
}
