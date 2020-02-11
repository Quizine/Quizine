import React, {Component} from 'react'
import Select from 'react-select'

export class CheckBoxField extends Component {
  constructor(props) {
    super(props)

    this.state = {selectedOptions: []}
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(selectedOptions) {
    this.setState({selectedOptions})
    console.log(this.state)
  }
  render() {
    const options = this.props.options.map(option => {
      return {value: option, label: option}
    })
    const {selectedOptions} = this.state
    return (
      <div>
        <Select
          options={options}
          isMulti
          onChange={this.handleChange}
          value={selectedOptions}
        />
        {/* {this.state.selectedOptions.map((o, idx) => (
          <p key={idx}>{o.value}</p>
        ))} */}
      </div>
    )
  }
}

export default CheckBoxField
