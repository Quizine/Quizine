import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getQueryResults} from '../../store/customizedQueryReducer'
import TableResults from './TableResults'

export class SubmitQueryButton extends Component {
  constructor(props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit() {
    this.props.loadQueryresults(this.props.currentQuery)
  }

  render() {
    return (
      <div className="submit-query-btn">
        <button type="submit" onClick={this.handleSubmit}>
          <h2>Submit me carefully!</h2>
        </button>
        {this.props.customQueryResult &&
        Object.keys(this.props.customQueryResult).length ? (
          <TableResults results={this.props.customQueryResult} />
        ) : null}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    currentQuery: state.customizedQuery.customQuery,
    customQueryResult: state.customizedQuery.customQueryResult
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadQueryresults: queryArray => dispatch(getQueryResults(queryArray))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SubmitQueryButton)
