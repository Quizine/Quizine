import React, {Component} from 'react'
import {connect} from 'react-redux'

export class NewQueryResults extends Component {
  //   componentDidMount() {
  //     this.props.getWaiterFields()
  //   }

  render() {
    const waiterRows = this.props.waiterRows

    return (
      <div>
        <ul>
          {waiterRows.map((waiter, idx) => {
            return <li key={idx}>{waiter.name}</li>
          })}
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
    waiterRows: state.waiters.rows
  }
}

export default connect(mapState)(NewQueryResults)
