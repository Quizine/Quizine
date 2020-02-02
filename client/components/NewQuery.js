import React, {Component} from 'react'
import NewQueryContainer from './NewQueryContainer'

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
          <option value="Menu">Menu</option>
          <option value="Waiters">Waiters</option>
          <option value="Orders">Orders</option>
        </select>
        {this.state.selected ? (
          <NewQueryContainer selected={this.state.selected} />
        ) : null}
      </div>
    )
  }
}

export default NewQuery
