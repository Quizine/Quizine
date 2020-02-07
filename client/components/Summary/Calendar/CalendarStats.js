import React, {Component} from 'react'
import {connect} from 'react-redux'

export class CalenderStats extends Component {
  render() {
    const {revenue, listOfWaiters, popularDish} = this.props.calendarData
    console.log('STATS', revenue, listOfWaiters, popularDish)
    console.log(`this.props: `, this.props)
    return (
      <div className="calendar-stats-cont">
        <div className="waiters-list">
          <h2>Waiters on duty:</h2>
          <ul className="waiters-list-li">
            {listOfWaiters.map((el, idx) => {
              return <li key={idx}>{el.name}</li>
            })}
          </ul>
        </div>
        <div className="dish-rev">
          <div>
            <h2>{`Revenue on ${this.props.currentDate.toDateString()}`}</h2>
            <h1>{`$ ${convertToDollar(Number(revenue))}`}</h1>
          </div>
          <div>
            <h2>Most popular dish of the day:</h2>
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