import React, {Component} from 'react'
import NewQueryFilters from './NewQueryFilters'

export class NewQuery extends Component {
  constructor() {
    super()
    this.state = {
      tables: {},
      selectedTable: ''
    }
    this.handleChange = this.handleChange.bind(this)
  }
  //CDM to get all column names on store

  handleChange(event) {
    this.setState({selectedTable: event.target.value})
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
        {this.state.selectedTable ? (
          <div>
            <NewQueryFilters
              selectedTable={this.state.selectedTable}
              columnNames={this.state.tables[this.state.selectedTable]}
            />
          </div>
        ) : null}
      </div>
    )
  }
}

export default NewQuery
