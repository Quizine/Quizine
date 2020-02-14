import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getMenuSalesNumbersVsMenuItemsTopOrBottom5} from '../../store/businessAnalyticsReducer'
import {Pie} from 'react-chartjs-2'
import _ from 'lodash'
import clsx from 'clsx'
import {Card, CardHeader, CardContent, Divider} from '@material-ui/core'

class MenuSalesNumbersVsMenuItemsTopOrBottom5 extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedOption: 'month',
      top: true
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  componentDidMount() {
    this.props.loadMenuSalesNumbersVsMenuItems(this.state.selectedOption)
  }

  handleChange(event) {
    this.setState({selectedOption: event.target.value})
    if (!Object.hasOwnProperty('top5')) {
      this.props.loadMenuSalesNumbersVsMenuItems(event.target.value)
    }
  }

  handleClick(event, value) {
    event.preventDefault()
    this.setState({top: value})
  }

  render() {
    const currTimeOption = this.state.selectedOption
    const topOrBottom = this.state.top ? 'top5' : 'bottom5'
    let labels = []
    let yAxis = []
    const labelText = this.state.top ? 'Top' : 'Bottom'

    if (this.props.topAndBottom5[currTimeOption][topOrBottom]) {
      labels = modifyArrOfStrings(
        this.props.topAndBottom5[currTimeOption][topOrBottom].xAxis
      )
      yAxis = this.props.topAndBottom5[currTimeOption][topOrBottom].yAxis
    }
    function financial(x) {
      return Number(Number.parseFloat(x).toFixed(2))
    }

    const sum = yAxis.reduce((acc, reducer) => {
      return acc + reducer
    }, 0)
    const piePercentages = yAxis.map(number => {
      return financial(100 * (number / sum))
    })

    const chartData = {
      labels: labels,
      datasets: [
        {
          data: piePercentages,
          backgroundColor: [
            '#b2b2b2',
            '#ecade6',
            '#aa57d0',
            '#3e4cbd',
            '#474747'
          ]
        }
      ]
    }

    return (
      <div className="peak-time-div">
        <Card className={clsx('classes.root, className')}>
          <CardHeader
            action={
              <div className="month-button">
                <select onChange={this.handleChange} className="select-css">
                  <option value="month">Month</option>
                  <option value="year">Year</option>
                  <option value="week">Week</option>
                </select>
                <button
                  type="button"
                  className="button1"
                  onClick={() => this.handleClick(event, true)}
                >
                  Top 5
                </button>
                <button
                  type="button"
                  className="button1"
                  onClick={() => this.handleClick(event, false)}
                >
                  Bottom 5
                </button>
              </div>
            }
            title={`${labelText} 5 Menu Items`}
          />
          <Divider />

          <CardContent>
            <div className="classes.chartContainer">
              <Pie
                data={chartData}
                options={{
                  title: {
                    display: false,
                    text: `${labelText} 5 Menu Items`
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
    topAndBottom5:
      state.businessAnalytics.menuSalesNumbersVsMenuItemsTopOrBottom5
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadMenuSalesNumbersVsMenuItems(timeInterval) {
      dispatch(getMenuSalesNumbersVsMenuItemsTopOrBottom5(timeInterval))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  MenuSalesNumbersVsMenuItemsTopOrBottom5
)

function modifyArrOfStrings(arr) {
  return arr.map(str => _.startCase(str))
}
