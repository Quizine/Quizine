import React, {Component} from 'react'
import Select from 'react-select'
import {connect} from 'react-redux'
import {updateOption} from '../../store/customizedQueryReducer'

class CheckBoxField extends Component {
  constructor(props) {
    super(props)

    this.state = {selectedOptions: []}
    this.handleChange = this.handleChange.bind(this)
  }

  async handleChange(selectedOptions) {
    await this.setState({selectedOptions})
    this.props.updateOptionForCustomQuery(
      this.props.selectedTable,
      this.props.selectedColumn,
      this.state.selectedOptions
        ? this.state.selectedOptions.map(element => element.value)
        : []
    )
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

const mapDispatchToProps = dispatch => {
  return {
    updateOptionForCustomQuery: (tableName, columnName, options) =>
      dispatch(updateOption(tableName, columnName, options))
  }
}

export default connect(null, mapDispatchToProps)(CheckBoxField)
