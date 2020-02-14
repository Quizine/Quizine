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
    this.props.loadQueryresults(
      this.props.currentQuery,
      this.props.arrangementQuery
    )
  }

  render() {
    return (
      <div>
        <div className="submit-query-btn">
          <button type="submit" onClick={this.handleSubmit}>
            <h2>Submit Search</h2>
          </button>
        </div>
        <div className="table-width">
          {this.props.customQueryResult &&
          Object.keys(this.props.customQueryResult).length ? (
            <TableResults results={this.props.customQueryResult} />
          ) : null}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    currentQuery: state.customizedQuery.customQuery,
    arrangementQuery: state.customizedQuery.arrangementQuery,
    customQueryResult: state.customizedQuery.customQueryResult
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadQueryresults: (queryArray, arragementQueryObj) =>
      dispatch(getQueryResults(queryArray, arragementQueryObj))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SubmitQueryButton)
