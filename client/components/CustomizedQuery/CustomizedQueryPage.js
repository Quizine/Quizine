import React, {Component} from 'react'
import {connect} from 'react-redux'
import CustomizedQueryTable from './CustomizedQueryTable'
import SubmitQueryButton from './SubmitQueryButton'

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
      <div className="query-cont">
        <div className="query-table">
          <div className="query-table-cont">
            <CustomizedQueryTable />
          </div>
          <div className="combine-btn">
            <button type="button" onClick={() => this.handleJoinClick()}>
              Combine With
            </button>
          </div>
        </div>
        <div>
          <SubmitQueryButton />
        </div>
      </div>
    )
  }
}
