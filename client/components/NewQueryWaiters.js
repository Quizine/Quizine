import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getWaiters} from '../store/waiterReducer'
import NewQueryWaitersSex from './NewQueryWaitersSex'

export class NewQueryWaiters extends Component {
  constructor() {
    super()
    this.state = {
      selected: false
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event) {
    this.setState({selected: event.target.value})
  }
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
            <select onChange={() => this.handleChange(event)}>
              {fields.map((field, idx) => {
                return <option key={idx}>{field}</option>
              })}
            </select>
            {this.state.selected ? (
              <div>
                <NewQueryWaitersSex selected={this.state.selected} />
              </div>
            ) : null}
            {/* <ul>
              {rows.map((waiter, idx) => {
                return <li key={idx}>{waiter.name}</li>
              })}
            </ul> */}
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

const mapDispatchToProps = dispatch => {
  return {
    getWaiters: () => dispatch(getWaiters())
  }
}

export default connect(mapState, mapDispatchToProps)(NewQueryWaiters)
