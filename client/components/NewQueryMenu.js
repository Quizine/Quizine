import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getMenuFields, getMenu} from '../store/menuReducer'

export class NewQueryMenu extends Component {
  componentDidMount() {
    this.props.getMenu() //SWITCH TO getMenuFields after POC
  }

  render() {
    const fields = this.props.fields
    const rows = this.props.rows
    const selected = this.props.selected
    const isSelected = selected === 'Menu'

    return (
      <div>
        {isSelected ? (
          <div>
            <select>
              {fields.map((field, idx) => {
                return <option key={idx}>{field}</option>
              })}
            </select>
            <ul>
              {rows.map((menu, idx) => {
                return <li key={idx}>{menu.menuName}</li>
              })}
            </ul>
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
    getMenuFields: () => dispatch(getMenuFields()),
    getMenu: () => dispatch(getMenu())
  }
}

export default connect(mapState, mapDispatchToProps)(NewQueryMenu)
