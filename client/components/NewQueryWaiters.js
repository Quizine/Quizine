import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getWaiters} from '../store/waiterReducer'

export class NewQueryWaiters extends Component {
  componentDidMount() {
    this.props.getWaiters()
  }

  render() {
    const fields = this.props.fields
    const rows = this.props.rows
    const selected = this.props.selected
    const isSelected = selected === 'Waiters'

    return (
      <div>
        {isSelected ? (
          <div>
            <select>
              {fields.map((field, idx) => {
                return <option key={idx}>{field}</option>
              })}
            </select>
            <ul>
              {rows.map((waiter, idx) => {
                return <li key={idx}>{waiter.name}</li>
              })}
            </ul>
          </div>
        ) : null}
      </div>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    rows: state.waiters.rows,
    fields: state.waiters.fields
  }
}

// mapState -> waiters, orders, menu

const mapDispatchToProps = dispatch => {
  return {
    getWaiters: () => dispatch(getWaiters())
  }
}

// dispatch -> getWaiters, getOrders, and getMenu

export default connect(mapState, mapDispatchToProps)(NewQueryWaiters)
