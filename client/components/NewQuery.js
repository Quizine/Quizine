import React, {Component} from 'react'
import NewQueryWaiters from './NewQueryWaiters'
import NewQueryOrders from './NewQueryOrders'
import NewQueryMenu from './NewQueryMenu'

export class NewQuery extends Component {
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

  render() {
    return (
      <div>
        <select onChange={() => this.handleChange(event)}>
          <option>Please Select</option>
          <option value="Menu">Menu</option>
          <option value="Waiters">Waiters</option>
          <option value="Orders">Orders</option>
        </select>
        {this.state.selected ? (
          <div>
            <NewQueryMenu selected={this.state.selected} />
            <NewQueryWaiters selected={this.state.selected} />
            <NewQueryOrders selected={this.state.selected} />
          </div>
        ) : null}
      </div>
    )
  }
}

export default NewQuery
