import React, {Component} from 'react'
import {connect} from 'react-redux'
import CustomizedQueryTable from './CustomizedQueryTable'

export default class CustomizedQueryPage extends Component {
  constructor() {
    super()
    this.state = {
      count: [1]
      // rerender: false
    }
    this.handleJoinClick = this.handleJoinClick.bind(this)
  }

  handleJoinClick() {
    this.setState({count: [...this.state.count, 1]})
  }

  render() {
    console.log('PAGE STATE', this.state)
    return (
      <div>
        <div>
          <CustomizedQueryTable />
        </div>
        <div>
          <button type="button" onClick={() => this.handleJoinClick()}>
            ----Join----
          </button>
        </div>
      </div>
    )
  }
}
