import React, {Component} from 'react'
import {connect} from 'react-redux'
import {
  getRevenueQueryResultsDate,
  getRevenueQueryResultsInterval
} from '../../store/revenueAnalyticsReducer'
import {Bar} from 'react-chartjs-2'
import clsx from 'clsx'
import {Card, CardHeader, CardContent, Divider} from '@material-ui/core'

class revenueAnalyticsGraphs extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedOption: '30',
      // eslint-disable-next-line react/no-unused-state
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
    let labels
    if (this.state.selectedQueryTitle === 'avgRevenuePerGuestVsDOW') {
      labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat']
    } else if (this.state.selectedQueryTitle === 'numberOfOrdersVsHour') {
      labels = [
        '11am',
        '12pm',
        '1pm',
        '2pm',
        '3pm',
        '4pm',
        '5pm',
        '6pm',
        '7pm',
        '8pm',
        '9pm',
        '10pm'
      ]
    }
    const yAxis = this.props.revenueQueryResults.yAxis

    const chartData = {
      labels: labels,
      datasets: [
        {
          display: false,
          label: '',
          data: yAxis,
          backgroundColor: '#24497A'
        }
      ]
    }
    const queryData = chartData.datasets[0].data
    if (!queryData) {
      return <h6>loading...</h6>
    }
    return (
      <div className="peak-time-div">
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
        <Card className={clsx('classes.root, className')}>
          <CardHeader
            action={
              <select
                onChange={this.handleChange}
                className="select-css"
                defaultValue="30"
              >
                <option value="365">Last 365 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="7">Last 7 Days</option>
                <option value="custom">Custom Dates</option>
              </select>
            }
            title={formatQueryName(this.state.selectedQueryTitle)}
          />
          <Divider />

          <CardContent>
            <div className="classes.chartContainer">
              <Bar
                data={chartData}
                options={{
                  title: {
                    display: false,
                    text: 'Average Revenue Per Guest ($)'
                  },
                  plugins: {
                    datalabels: {
                      display: false
                    }
                  },
                  scales: {
                    yAxes: [
                      {
                        ticks: {
                          suggestedMin: 0, //(guest$.min()) * .5,
                          suggestedMax: queryData.max() * 1.1 //guest$.max()
                        }
                      }
                    ]
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>
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
  revenueAnalyticsGraphs
)

function formatQueryName(name) {
  name = name.replace(/([A-Z])/g, ' $1')
  name = name[0].toUpperCase() + name.slice(1)
  return name
}
