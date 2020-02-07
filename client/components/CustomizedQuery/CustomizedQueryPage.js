import React, {Component} from 'react'
import NewQueryFilters from './CustomizedQueryFilters'
import {connect} from 'react-redux'
import {getTableFields} from '../../store/customizedQueryReducer'

export class NewQuery extends Component {
  constructor() {
    super()
    this.state = {
      selectedTable: ''
    }
    this.handleChange = this.handleChange.bind(this)
  }
  //CDM to get all column names on store
  componentDidMount() {
    this.props.loadTableFields()
  }
  handleChange(event) {
    this.setState({selectedTable: event.target.value})
  }

  render() {
    const tableFields = this.props.tableFields

    return (
      <div>
        <select onChange={() => this.handleChange(event)}>
          <option>Please Select</option>
          <option value="menus">Menu</option>
          <option value="waiters">Waiters</option>
          <option value="orders">Orders</option>
        </select>

        <div>
          {this.state.selectedTable ? (
            <div>
              <NewQueryFilters
                selectedTable={this.state.selectedTable}
                columnNames={tableFields[this.state.selectedTable]}
              />
            </div>
          ) : null}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    tableFields: state.customizedQuery.tableFields
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadTableFields: () => {
      dispatch(getTableFields())
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(NewQuery)
