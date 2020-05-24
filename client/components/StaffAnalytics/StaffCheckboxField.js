import React, {Component} from 'react'
import Select from 'react-select'

export default class StaffCheckBoxField extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(selectedOptions) {
    this.props.nameChange(selectedOptions)
  }
  render() {
    const options = this.props.allNames.map(option => {
      return {value: option, label: option}
    })
    const {optionNames} = this.props
    return (
      <div>
        <Select
          options={options}
          isMulti
          onChange={this.handleChange}
          value={optionNames}
          placeholder="Select Staff Name..."
        />
      </div>
    )
  }
}
