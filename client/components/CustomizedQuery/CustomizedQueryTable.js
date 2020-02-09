import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getTableFields} from '../../store/customizedQueryReducer'
import CustomizedQuerySelect from './CustomizedQuerySelect'
import CustomizedQueryJoin from './CustomizedQueryJoin'

export class CustomizedQuery extends Component {
  constructor() {
    super()
    this.state = {
      selectedTable: '',
      count: [1]
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleAddClick = this.handleAddClick.bind(this)
    this.handleRemoveClick = this.handleRemoveClick.bind(this)
  }

  handleChange(event) {
    this.props.loadTableFields(event.target.value)
    this.setState({selectedTable: event.target.value})
  }

  handleAddClick() {
    this.setState({count: [...this.state.count, 1]})
  }

  handleRemoveClick() {
    let updatedState = [...this.state.count]
    updatedState.pop()
    this.setState({count: updatedState})
  }
  render() {
    const selectedTable = this.state.selectedTable
    const selectedColumns = this.props.tableFields
    return (
      <div className="custom-analytics-container">
        <select onChange={() => this.handleChange(event)}>
          <option>Please Select</option>
          <option value="menus">Menu</option>
          <option value="waiters">Waiters</option>
          <option value="orders">Orders</option>
        </select>
        <div>
          {/* {selectedTable ? (
            <CustomizedQueryJoin selectedTable={selectedTable} />
          ) : null} */}
          {selectedColumns.length ? (
            <div>
              <div>
                {this.state.count.map((element, index) => {
                  return (
                    <div key={index}>
                      <CustomizedQuerySelect
                        selectedTable={selectedTable}
                        columnNames={selectedColumns}
                      />
                    </div>
                  )
                })}
              </div>
              {this.state.count.length < selectedColumns.length ? (
                <button type="button" onClick={() => this.handleAddClick()}>
                  Add
                </button>
              ) : null}
              {this.state.count.length ? (
                <button type="button" onClick={() => this.handleRemoveClick()}>
                  Remove
                </button>
              ) : null}
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
