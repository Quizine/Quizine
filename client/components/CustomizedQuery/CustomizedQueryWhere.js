import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getValueOptionsForString} from '../../store/customizedQueryReducer'
import IntegersInputField from './IntegersInputField'
import TimeFrameField from './TimeFrameField'
import CheckBoxField from './CheckBoxField'
import _ from 'lodash'

class CustomizedQueryWhere extends Component {
  constructor() {
    super()
    this.state = {
      selectedValueOption: []
    }
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
            <h3>{`Where ${_.startCase(selectedColumn)} is:`}</h3>
            <CheckBoxField
              selectedTable={selectedTable}
              selectedColumn={selectedColumn}
              options={options}
            />
          </div>
        ) : (
          <div>
            {isIntegerField ? (
              <IntegersInputField
                selectedTable={selectedTable}
                selectedColumn={selectedColumn}
                dataType={dataType}
              />
            ) : (
              <TimeFrameField
                selectedTable={selectedTable}
                selectedColumn={selectedColumn}
                dataType={dataType}
              />
            )}
          </div>
        )}
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
