import React, {Component} from 'react'
import {Menu} from '@material-ui/core'
import {getAvgNumberOfGuestsVsWaitersPerOrder} from '../../store/businessAnalyticsReducer'

export default class CustomizedQuerySelect extends Component {
  constructor() {
    super()
    this.state = {
      selectedValueOption: ''
    }
    this.handleValueOptionChange = this.handleValueOptionChange.bind(this)
  }

  handleValueOptionChange(event) {
    this.setState({selectedValueOption: event.target.value})
  }

  render() {
    const valueOptionsForString = this.props.valueOptionsForString
    return (
      <div>
        {valueOptionsForString.length ? (
          <div>
            <h3>WHERE:</h3>
            <select onChange={() => this.handleValueOptionChange(event)}>
              <option defaultValue>Please Select</option>
              {valueOptionsForString.map((valueOptionName, idx) => {
                return (
                  <option key={idx} value={valueOptionName.aliasname}>
                    {formatValueOptionName(valueOptionName.aliasname)}
                  </option>
                )
              })}
            </select>
          </div>
        ) : null}
      </div>
    )
  }
}

function formatValueOptionName(name) {
  name = name.replace(/([A-Z])/g, ' $1') // CONVERTS NAMES OF DB COLUMNS INTO READABLE TEXT
  name = name[0].toUpperCase() + name.slice(1)
  return name
}