import React, {Component} from 'react'
import {connect} from 'react-redux'

export class SubmitQueryButton extends Component {
  constructor(props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit() {
    console.log('SEND QUERY TO BACKEND', this.props.currentQuery)
  }

  render() {
    return (
      <div>
        <button type="submit" onClick={this.handleSubmit}>
          <h2>Submit me carefully!</h2>
        </button>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    currentQuery: state.customizedQuery.customQuery
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(SubmitQueryButton)
