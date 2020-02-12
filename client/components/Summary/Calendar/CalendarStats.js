import React, {Component} from 'react'
import {connect} from 'react-redux'
import _ from 'lodash'

export class CalenderStats extends Component {
  render() {
    const {revenue, listOfWaiters, popularDish} = this.props.calendarData
    return (
      <div className="calendar-stats-cont">
        <div className="waiters-list">
          {/* <h2>Waiters on Duty:</h2> */}
          <h2>
            Waiters on Duty on
            <span>
              <i>{` ${this.props.currentDate.toDateString()}`}:</i>
            </span>
          </h2>
          <ul className="waiters-list-li">
            {listOfWaiters.map((el, idx) => {
              return <li key={idx}>{el.name}</li>
            })}
          </ul>
        </div>
        <div className="dish-rev">
          <div>
            <h2>
              Revenue on
              <span>
                <i>{` ${this.props.currentDate.toDateString()}`}:</i>
              </span>
            </h2>
            <h2 color="black">{`$ ${convertToDollar(Number(revenue))}`}</h2>
          </div>
          <div>
            <h2>Most Popular Dish of the Day:</h2>

            <h2>{_.startCase(popularDish)}</h2>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    calendarData: state.summary.calendarData
  }
}

export default connect(mapStateToProps)(CalenderStats)

function convertToDollar(num) {
  return num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
}
