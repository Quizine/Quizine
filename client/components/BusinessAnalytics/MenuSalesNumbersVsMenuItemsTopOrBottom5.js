import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getMenuSalesNumbersVsMenuItemsTopOrBottom5} from '../../store/businessAnalyticsReducer'
import {Pie} from 'react-chartjs-2'
import _ from 'lodash'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import {makeStyles} from '@material-ui/styles'
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Button
} from '@material-ui/core'

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
    if (!Object.keys(this.props.topAndBottom5[event.target.value]).length) {
      this.props.loadMenuSalesNumbersVsMenuItems(event.target.value)
    }
  }

  handleClick(event, value) {
    event.preventDefault()
    this.setState({top: value})
  }

  render() {
    const labelsNotModified = this.state.top
      ? this.props.topAndBottom5.xAxisTop
      : this.props.topAndBottom5.xAxisBottom
    const labels = modifyArrOfStrings(labelsNotModified)
    const yAxis = this.state.top
      ? this.props.topAndBottom5.yAxisTop
      : this.props.topAndBottom5.yAxisBottom
    const labelText = this.state.top ? 'Top' : 'Bottom'

    const chartData = {
      labels: labels,
      datasets: [
        {
          data: yAxis,
          backgroundColor: randomColor(yAxis.length)
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
                  onClick={() => this.handleClick(event, false)}
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

              // <DropdownComponent handleChangeData={this.handleChange} />
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
                    display: true,
                    text: `${labelText} 5 Menu Items`
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      // <div className="peak-time-div">
      //   <select onChange={this.handleChange}>
      //     <option value="month">Month</option>
      //     <option value="year">Year</option>
      //     <option value="week">Week</option>
      //   </select>
      //   <Button
      //     variant="contained"
      //     color="primary"
      //     onClick={() => this.handleClick(event, true)}
      //   >
      //     TOP 5
      //   </Button>
      //   <Button
      //     variant="contained"
      //     color="primary"
      //     onClick={() => this.handleClick(event, false)}
      //   >
      //     BOTTOM 5
      //   </Button>
      //   <div>
      //     <Pie
      //       data={chartData}
      //       options={{
      //         title: {
      //           display: true,
      //           text: `${labelText} 5 Menu Items`
      //         }
      //       }}
      //     />
      //   </div>
      // </div>
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

//RANDOM COLOR GENERATOR, takes the length of an array
function randomColor(length) {
  let colorArray = [
    '#FF6633',
    '#FFB399',
    '#FF33FF',
    '#FFFF99',
    '#00B3E6',
    '#E6B333',
    '#3366E6',
    '#999966',
    '#99FF99',
    '#B34D4D',
    '#80B300',
    '#809900',
    '#E6B3B3',
    '#6680B3',
    '#66991A',
    '#FF99E6',
    '#CCFF1A',
    '#FF1A66',
    '#E6331A',
    '#33FFCC',
    '#66994D',
    '#B366CC',
    '#4D8000',
    '#B33300',
    '#CC80CC',
    '#66664D',
    '#991AFF',
    '#E666FF',
    '#4DB3FF',
    '#1AB399',
    '#E666B3',
    '#33991A',
    '#CC9999',
    '#B3B31A',
    '#00E680',
    '#4D8066',
    '#809980',
    '#E6FF80',
    '#1AFF33',
    '#999933',
    '#FF3380',
    '#CCCC00',
    '#66E64D',
    '#4D80CC',
    '#9900B3',
    '#E64D66',
    '#4DB380',
    '#FF4D4D',
    '#99E6E6',
    '#6666FF'
  ]
  let newArr = []
  for (let i = 0; i < length; i++) {
    newArr.push(colorArray[i])
  }
  return newArr
}
