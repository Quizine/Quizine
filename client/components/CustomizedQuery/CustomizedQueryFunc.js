import React, {Component} from 'react'
import {connect} from 'react-redux'
// import _ from 'lodash'
import {updateColumn} from '../../store/customizedQueryReducer'

const funcTypeOperators = [
  {Total: 'sum'}, // Questionable
  {Average: 'avg'},
  {Minimum: 'min'},
  {Maximum: 'max'},
  {Count: 'count'}
]

class CustomizedQueryFunc extends Component {
  constructor() {
    super()
    this.state = {
      selectedFunc: ''
    }
  }

  async handleFuncSelect(event) {
    await this.setState({selectedFunc: event.target.value})
    const dataType = await extractDataType(
      this.props.selectedTable,
      this.props.selectedColumn,
      this.props.metaData
    )
    this.props.updateColumn(
      this.props.selectedTable,
      this.props.selectedColumn,
      dataType,
      this.state.selectedFunc
    )
  }

  render() {
    const dataType = extractDataType(
      this.props.selectedTable,
      this.props.selectedColumn,
      this.props.metaData
    )
    const isInteger = dataType === 'integer'
    const selectedFunc = this.props.selectedFuncType

    return (
      <div>
        {isInteger ? (
          <div>
            {!selectedFunc ? (
              <h3>Select Math Operation:</h3>
            ) : (
              <h3>Selected Math Operation:</h3>
            )}

            {!selectedFunc ? (
              <div>
                <select
                  className="select-cust"
                  onChange={() => this.handleFuncSelect(event)}
                >
                  <option value="default">Please Select</option>
                  {funcTypeOperators.map((option, idx) => {
                    return (
                      <option key={idx} value={Object.values(option)[0]}>
                        {Object.keys(option)[0]}
                      </option>
                    )
                  })}
                </select>
              </div>
            ) : (
              <h2>{findKey(funcTypeOperators, selectedFunc)}</h2>
            )}
          </div>
        ) : null}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    metaData: state.customizedQuery.metaData
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateColumn: (tableName, columnName, dataType, funcType) => {
      dispatch(updateColumn(tableName, columnName, dataType, funcType))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomizedQueryFunc)

function extractDataType(tableName, columnName, array) {
  return array
    .filter(element => {
      return Object.keys(element)[0] === tableName
    })[0]
    [tableName].filter(element => {
      return Object.keys(element)[0] === columnName
    })[0][columnName].dataType
}

function findKey(arr, value) {
  return Object.keys(arr.filter(el => Object.values(el)[0] === value)[0])[0]
}
