import React, {Component} from 'react'
import CustomizedQuerySelect from './CustomizedQuerySelect'
import {connect} from 'react-redux'
import {getTableFields} from '../../store/customizedQueryReducer'

export class CustomizedQuery extends Component {
  constructor() {
    super()
    this.state = {
      count: [1]
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleForLoop = this.handleForLoop.bind(this)
  }

  handleForLoop(number, input) {
    let resultArr = []
    for (let i = 1; i <= number; i++) {
      resultArr.push(input)
    }
    return resultArr
  }

  handleChange(event) {
    this.props.loadTableFields(event.target.value)
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
    const selectedColumns = this.props.tableFields

    console.log('STATE', this.state.count)
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
              <div>
                {this.state.count.map((element, index) => {
                  return (
                    <CustomizedQuerySelect
                      key={index}
                      columnNames={selectedColumns}
                    />
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
