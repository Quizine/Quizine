import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getOrderFields, getOrders} from '../store/orderReducer'

export class NewQueryOrders extends Component {
  componentDidMount() {
    this.props.getOrderFields()
  }

  render() {
    const fields = this.props.fields
    const selected = this.props.selected
    const isSelected = selected === 'Orders'

    return (
      <div>
        {isSelected ? (
          <select>
            {fields.map((field, idx) => {
              return <option key={idx}>{field}</option>
            })}
          </select>
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
    rows: state.orders.rows,
    fields: state.orders.fields
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getOrderFields: () => dispatch(getOrderFields()),
    getOrders: () => dispatch(getOrders())
  }
}

export default connect(mapState, mapDispatchToProps)(NewQueryOrders)
