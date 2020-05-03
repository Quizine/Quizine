import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getPeakTimeOrders} from '../../store/summaryReducer'
import {Bar} from 'react-chartjs-2'
import clsx from 'clsx'
import {Card, CardHeader, CardContent, Divider} from '@material-ui/core'

class PeakTimeGraph extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedOption: '30'
    }
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    this.props.loadPeakTimeOrders(this.state.selectedOption)
  }

  handleChange(event) {
    this.setState({selectedOption: event.target.value})
    this.props.loadPeakTimeOrders(event.target.value)
  }

  render() {
    const labels = this.props.peakTimeOrders.xAxis
    const arrPerc = this.props.peakTimeOrders.yAxis

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Percentage',
          data: arrPerc,
          backgroundColor: 'yellow'
        }
      ]
    }
    if (!arrPerc) {
      return <h6>loading...</h6>
    }
    return (
      <div className="peak-time-div">
        <Card className={clsx('classes.root, className')}>
          <CardHeader
            action={
              <select
                onChange={this.handleChange}
                className="select-css"
                defaultValue="30"
              >
                <option value="365">Last 1 Year</option>
                <option value="30">Last 30 Days</option>
                <option value="7">Last 7 Days</option>
              </select>
            }
            title="Guest Distribution Percentage Per Hour"
          />
          <Divider />
          <CardContent>
            <div className="classes.chartContainer">
              <Bar
                data={chartData}
                options={{
                  title: {
                    display: false
                  },
                  legend: {
                    display: false
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
                          suggestedMin: 0,
                          suggestedMax: arrPerc.max() * 1.1,
                          callback: function(value) {
                            return value + '%'
                          }
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
    peakTimeOrders: state.summary.peakTimeOrdersVsTime
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadPeakTimeOrders: timeInterval =>
      dispatch(getPeakTimeOrders(timeInterval))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PeakTimeGraph)
