import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getMenuSalesNumbersVsMenuItemsTopOrBottom5} from '../../store/summaryReducer'
import {Doughnut} from 'react-chartjs-2'
import 'chartjs-plugin-datalabels'
import _ from 'lodash'
import clsx from 'clsx'
import {Card, CardHeader, CardContent, Divider} from '@material-ui/core'
import PopularMenuItemsTopOrBottom5Buttons from './PopularMenuItemsTopOrBottom5Buttons'

class PopularMenuItemsTopOrBottom5 extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedOption: '30',
      top: true
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleChangeButton = this.handleChangeButton.bind(this)
  }

  componentDidMount() {
    this.props.loadMenuSalesNumbersVsMenuItems(this.state.selectedOption)
  }

  handleChange(event) {
    this.setState({selectedOption: event.target.value})
    this.props.loadMenuSalesNumbersVsMenuItems(event.target.value)
  }

  handleChangeButton(event) {
    event.preventDefault()
    if (event.target.innerText.slice(0, 3) === 'Top') {
      this.setState({top: true})
    } else {
      this.setState({top: false})
    }
  }

  // eslint-disable-next-line complexity
  render() {
    const topOrBottom = this.state.top ? 'top5' : 'bottom5'
    let labels = []
    let yAxis = []
    const labelText = this.state.top ? 'Top' : 'Bottom'
    if (
      this.props.topAndBottom5[topOrBottom] &&
      this.props.topAndBottom5[topOrBottom].xAxis
    ) {
      labels = modifyArrOfStrings(this.props.topAndBottom5[topOrBottom].xAxis)
      yAxis = this.props.topAndBottom5[topOrBottom].yAxis
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
            '#035AA6',
            '#0779E4',
            '#4CBBB9',
            '#77D8D8',
            '#8566AA'
          ]
        }
      ]
    }

    const options = {
      responsive: true,
      plugins: {
        datalabels: {
          display: true,
          color: '#fff',
          anchor: 'end',
          align: 'start',
          offset: -5,
          borderWidth: 2,
          borderColor: '#fff',
          borderRadius: 25,
          backgroundColor: context => {
            return context.dataset.backgroundColor
          },
          font: {
            weight: 'bold',
            size: '11'
          },
          formatter: value => {
            return value + ' %'
          }
        }
      }
    }

    return (
      <div className="summary-top-bottom-menu-items">
        <Card className={clsx('classes.root, className')}>
          <CardHeader
            align="center"
            action={
              <div className="month-button">
                <select
                  onChange={this.handleChange}
                  className="select-cust-time-interval"
                  defaultValue="30"
                >
                  <option value="365">Last 1 Year</option>
                  <option value="30">Last 30 Days</option>
                  <option value="7">Last 7 Days</option>
                </select>
              </div>
            }
            title={`${labelText} 5 Menu Items`}
          />
          <PopularMenuItemsTopOrBottom5Buttons
            handleChangeButton={this.handleChangeButton}
            handleClick={this.handleClick}
            topGraphOption={this.state.top}
          />
          <Divider />

          <CardContent>
            <div className="classes.chartContainer">
              <Doughnut data={chartData} options={options} />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    topAndBottom5: state.summary.menuSalesNumbersVsMenuItemsTopOrBottom5
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
  PopularMenuItemsTopOrBottom5
)

function modifyArrOfStrings(arr) {
  return arr.map(str => _.startCase(str))
}
