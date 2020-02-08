import React, {Component} from 'react'
import CustomizedQueryFilters from './CustomizedQueryFilters'
import {connect} from 'react-redux'
import {getTableFields} from '../../store/customizedQueryReducer'

export class CustomizedQuery extends Component {
  constructor() {
    super()
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event) {
    this.props.loadTableFields(event.target.value)
  }

  render() {
    const selectedColumns = this.props.tableFields

    return (
      <div>
        <select onChange={() => this.handleChange(event)}>
          <option>Please Select</option>
          <option value="menus">Menu</option>
          <option value="waiters">Waiters</option>
          <option value="orders">Orders</option>
        </select>

        <div>
          {selectedColumns.length ? (
            <div>
              <CustomizedQueryFilters columnNames={selectedColumns} />
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
    loadTableFields: tableName => {
      dispatch(getTableFields(tableName))
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(CustomizedQuery)
