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
      return {value: option, label: formatName(option)}
    })
    const {optionNames} = this.props
    return (
      <div>
        <Select
          options={options}
          isMulti
          onChange={this.handleChange}
          value={optionNames}
          placeholder="Select Name..."
        />
        <h5>*Leave Blank to Show All</h5>
        {/* {this.state.selectedOptions.map((o, idx) => (
          <p key={idx}>{o.value}</p>
        ))} */}
      </div>
    )
  }
}

// const mapDispatchToProps = dispatch => {
//   return {
//     updateOptionForCustomQuery: (tableName, columnName, options) =>
//       dispatch(updateOption(tableName, columnName, options))
//   }
// }

// export default connect(null, mapDispatchToProps)(StaffCheckBoxField)

function formatName(name) {
  name = name.replace(/([A-Z])/g, ' $1') // CONVERTS NAMES OF DB COLUMNS INTO READABLE TEXT
  name = name[0].toUpperCase() + name.slice(1)
  return name
}
