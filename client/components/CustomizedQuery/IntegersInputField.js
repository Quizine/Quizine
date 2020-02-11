import React, {Component} from 'react'

const operators = [
  {'Equal to': '='},
  {'Greater than': '>'},
  {'Less than': '<'},
  {'Greater than or equal to': '>='},
  {'Less than or equal to': '<='},
  {'Not equal to': '<>'},
  {Between: 'BETWEEN'}
]

export class IntegersInputField extends Component {
  constructor(props) {
    super(props)

    this.state = {
      inputValue: '',
      betweenValue: '',
      operator: ''
    }
    this.handleWhereSelect = this.handleWhereSelect.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleBetweenInputChange = this.handleBetweenInputChange.bind(this)
  }

  handleWhereSelect(event) {
    this.setState({operator: event.target.value})
  }

  handleInputChange(event) {
    this.setState({inputValue: event.target.value})
  }

  handleBetweenInputChange(event) {
    this.setState({betweenValue: event.target.value})
  }

  render() {
    return (
      <div>
        <h3>INTEGERS WHERE</h3>
        <select onChange={() => this.handleWhereSelect(event)}>
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
            <input onBlur={this.handleInputChange} type="number" />
            {this.state.operator === 'BETWEEN' ? (
              <div>
                <p>and</p>
                <br />
                <input onBlur={this.handleBetweenInputChange} type="number" />
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    )
  }
}

export default IntegersInputField
