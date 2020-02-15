import React, {Component} from 'react'
import {connect} from 'react-redux'
import {updateOption} from '../../store/customizedQueryReducer'

const operators = [
  {'Equal to': '$is'}, // Questionable
  {'Greater than': '$gt'},
  {'Less than': '$lt'},
  {'Greater than or equal to': '$gte'},
  {'Less than or equal to': '$lte'},
  {'Not equal to': '$isNot'},
  {Between: '$between'}
]

export class IntegersInputField extends Component {
  constructor(props) {
    super(props)

    this.state = {
      inputValue: '',
      betweenValue: '',
      operator: '$is'
    }
    this.handleWhereSelect = this.handleWhereSelect.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleBetweenInputChange = this.handleBetweenInputChange.bind(this)
  }

  handleWhereSelect(event) {
    this.setState({operator: event.target.value})
  }

  async handleInputChange(event) {
    await this.setState({inputValue: event.target.value})
    this.props.updateOptionForCustomQuery(
      this.props.selectedTable,
      this.props.selectedColumn,
      [this.state.operator, +this.state.inputValue]
    )
  }

  async handleBetweenInputChange(event) {
    await this.setState({betweenValue: event.target.value})
    this.props.updateOptionForCustomQuery(
      this.props.selectedTable,
      this.props.selectedColumn,
      [this.state.operator, +this.state.inputValue, +this.state.betweenValue]
    )
  }

  render() {
    return (
      <div>
        <h3>{`Where ${formatColumnName(this.props.selectedColumn)} is:`}</h3>
        <select
          className="select-cust"
          onChange={() => this.handleWhereSelect(event)}
        >
          {operators.map((option, idx) => {
            return (
              <option key={idx} value={Object.values(option)[0]}>
                {Object.keys(option)[0]}
              </option>
            )
          })}
        </select>
        {this.state.operator ? (
          <div>
            <input
              className="integer-input"
              onBlur={this.handleInputChange}
              type="number"
            />
            {this.state.operator === '$between' ? (
              <div>
                <h3>and</h3>
                <br />
                <input
                  onBlur={this.handleBetweenInputChange}
                  type="number"
                  className="integer-input"
                />
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateOptionForCustomQuery: (tableName, columnName, options) =>
      dispatch(updateOption(tableName, columnName, options))
  }
}

export default connect(null, mapDispatchToProps)(IntegersInputField)

function formatColumnName(name) {
  name = name.replace(/([A-Z])/g, ' $1') // CONVERTS NAMES OF DB COLUMNS INTO READABLE TEXT
  name = name[0].toUpperCase() + name.slice(1)
  return name
}
