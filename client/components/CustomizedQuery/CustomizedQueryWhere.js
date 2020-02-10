import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getValueOptionsForString} from '../../store/customizedQueryReducer'

class CustomizedQueryWhere extends Component {
  constructor() {
    super()
    this.state = {
      selectedValueOption: ''
    }
    this.handleValueOptionChange = this.handleValueOptionChange.bind(this)
  }

  componentDidMount() {
    console.log('IN CDM!!!!!!!!!!!!!!!!!')
    this.props.loadValueOptionsForString(
      this.props.selectedTable,
      this.props.selectedColumn
    )
  }

  handleValueOptionChange(event) {
    this.setState({selectedValueOption: event.target.value})
  }

  render() {
    console.log('WHERE PROPS', this.props)

    const {selectedTable, selectedColumn, metaData} = this.props

    const valueOptionsForString = optionsMapping(
      selectedTable,
      selectedColumn,
      metaData
    )
    return (
      <div>
        {valueOptionsForString.length ? (
          <div>
            <h3>WHERE:</h3>
            <select onChange={() => this.handleValueOptionChange(event)}>
              <option defaultValue>Please Select</option>
              {valueOptionsForString.map((valueOptionName, idx) => {
                return (
                  <option key={idx} value={valueOptionName}>
                    {formatValueOptionName(valueOptionName)}
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
    })[0][columnName].options
}
