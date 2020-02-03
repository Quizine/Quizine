import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getQueryWaiters, getWaiters} from '../store/waiterReducer'
import NewQueryResults from './NewQueryResults'


export class NewQueryWaitersSex extends Component {
  constructor() {
    super()
    this.state = {
      selected: false
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event) {
    this.setState({selected: event.target.value})

    this.props.getQueryWaiters(this.props.selected, event.target.value)
    // this.props.getWaiters()
  }
  // componentDidMount() {
  //   this.props.getQueryWaiters()
  // }

  render() {
    const fields = this.props.fields
    const rows = this.props.rows
    const selected = this.props.selected
    const isSelected = selected === 'Sex'

    return (
      <div>
        {isSelected ? (
          <div>
            <select onChange={() => this.handleChange(event)}>
              <option>Select Sex</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            {this.state.selected ? (
              <div>
                <NewQueryResults />
              </div>
            ) : null}
          </div>
        ) : null}
        <ul>
          {/* {rows &&
            rows.map((waiter, idx) => {
              return <li key={idx}>{waiter.name}</li>
            })} */}
        </ul>
      </div>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    rows: state.waiters.rows,
    fields: state.waiters.fields
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getQueryWaiters: (queryField, queryInput) =>
      dispatch(getQueryWaiters(queryField, queryInput)),
    getWaiters: () => dispatch(getWaiters())
  }
}

export default connect(mapState, mapDispatchToProps)(NewQueryWaitersSex)
