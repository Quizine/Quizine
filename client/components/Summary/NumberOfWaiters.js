import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getNumberOfWaiters} from '../../store/summaryReducer'

export class NumberOfWaiters extends Component {
  componentDidMount() {
    this.props.loadNumOfWaiters()
  }

  render() {
    return (
      <div>
        <h2>You have currently {this.props.numOfWaiters} in your restaurant</h2>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    numOfWaiters: state.summary.numberOfWaiters
  }
}

const MapDispatchToProps = dispatch => {
  return {
    loadNumOfWaiters: () => dispatch(getNumberOfWaiters())
  }
}

export default connect(mapStateToProps, MapDispatchToProps)(NumberOfWaiters)
