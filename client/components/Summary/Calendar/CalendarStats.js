import React, {Component} from 'react'
import {connect} from 'react-redux'

export class CalenderStats extends Component {
  render() {
    const {revenue, listOfWaiters, popularDish} = this.props.calendarData
    return (
      <div className="calendar-stats-cont">
        <div className="waiters-list">
          <h2>Waiters on Duty:</h2>
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
              <span color="black">
                <i>{` ${this.props.currentDate.toDateString()}`}:</i>
              </span>
            </h2>
            <h1>{`$ ${convertToDollar(Number(revenue))}`}</h1>
          </div>
          <div>
            <h2>Most Popular Dish of the Day:</h2>
            <h1>{popularDish.toUpperCase()}</h1>
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
  return (num / 100).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
}
