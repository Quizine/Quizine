import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getMenu} from '../store/menuReducer'
import D3BarChart from './D3/D3BarChart'

export class NewQueryMenu extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedType: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.generateDataForD3 = this.generateDataForD3.bind(this)
  }
  componentDidMount() {
    this.props.getMenu()
  }

  handleChange(e) {
    this.setState({selectedType: e.target.value})
  }

  generateDataForD3(arr) {
    const hash = {}
    const arrOfTypes = arr.map(el => el[this.state.selectedType])
    arrOfTypes.forEach(el => {
      if (hash[el]) {
        hash[el]++
      } else {
        hash[el] = 1
      }
    })
    let keys = []
    let numbers = []
    for (let key in hash) {
      if (hash.hasOwnProperty(key)) {
        keys.push(key)
        numbers.push(hash[key])
      }
    }
    return [keys, numbers]
  }

  render() {
    const fields = this.props.fields
    const rows = this.props.rows
    const selected = this.props.selected
    const isSelected = selected === 'Menu'
    const rowsToDisplay = rows.filter(row => row[this.state.selectedType])
    const [xData, yData] = this.generateDataForD3(rowsToDisplay)

    return (
      <div>
        {isSelected ? (
          <div>
            <select onChange={this.handleChange}>
              {fields.map((field, idx) => {
                return (
                  <option key={idx} value={field}>
                    {field}
                  </option>
                )
              })}
            </select>

            {this.state.selectedType ? (
              <div className="chartDiv">
                <ul>
                  {rowsToDisplay.map((menu, idx) => {
                    return <li key={idx}>{menu.menuName}</li>
                  })}
                </ul>
                <D3BarChart xData={xData} yData={yData} />
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    rows: state.menu.rows,
    fields: state.menu.fields
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getMenu: () => dispatch(getMenu())
  }
}

export default connect(mapState, mapDispatchToProps)(NewQueryMenu)
