import React, {Component} from 'react'
import {connect} from 'react-redux'
import {
  getValueOptionsForString,
  updateOption
} from '../../store/customizedQueryReducer'
import IntegersInputField from './IntegersInputField'
import TimeFrameField from './TimeFrameField'

class CustomizedQueryWhere extends Component {
  constructor() {
    super()
    this.state = {
      selectedValueOption: []
    }
    this.handleValueOptionChange = this.handleValueOptionChange.bind(this)
  }

  async handleValueOptionChange(event) {
    await this.setState({
      selectedValueOption: [...selectedValueOption, event.target.value]
    })
  }

  render() {
    const {selectedTable, selectedColumn, metaData} = this.props

    const {options, dataType} = optionsMapping(
      selectedTable,
      selectedColumn,
      metaData
    )

    const isIntegerField = dataType === 'integer'

    return (
      <div>
        {options.length ? (
          <div>
            <h3>WHERE:</h3>
            <select onChange={() => this.handleValueOptionChange(event)}>
              <option defaultValue>Please Select</option>
              {options.length &&
                options.map((valueOptionName, idx) => {
                  return (
                    <option key={idx} value={valueOptionName}>
                      {formatValueOptionName(valueOptionName)}
                    </option>
                  )
                })}
            </select>
          </div>
        ) : (
          <div>
            {isIntegerField ? (
              <IntegersInputField dataType={dataType} />
            ) : (
              <TimeFrameField dataType={dataType} />
            )}
          </div>
        )}
      </div>
    )
  }
}

function formatValueOptionName(name) {
  name = name.replace(/([A-Z])/g, ' $1') // CONVERTS NAMES OF DB COLUMNS INTO READABLE TEXT
  name = name[0].toUpperCase() + name.slice(1)
  return name
}

const mapStateToProps = state => {
  return {
    metaData: state.customizedQuery.metaData
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadValueOptionsForString: (tableName, columnName) =>
      dispatch(getValueOptionsForString(tableName, columnName))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  CustomizedQueryWhere
)

function optionsMapping(tableName, columnName, array) {
  return array
    .filter(element => {
      return Object.keys(element)[0] === tableName
    })[0]
    [tableName].filter(columnElement => {
      return Object.keys(columnElement)[0] === columnName
    })[0][columnName]
}
