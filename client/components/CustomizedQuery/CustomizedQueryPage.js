import React, {Component} from 'react'
import {connect} from 'react-redux'
import CustomizedQueryTable from './CustomizedQueryTable'
import SubmitQueryButton from './SubmitQueryButton'
import {
  addEmptyTable,
  clearCustomQuery,
  gotCustomQueryResult,
  getJoinTables,
  clearJoinTables
} from '../../store/customizedQueryReducer'

class CustomizedQueryPage extends Component {
  constructor() {
    super()

    this.handleJoinClick = this.handleJoinClick.bind(this)
  }
  componentDidMount() {
    this.props.clearCustomQuery()
    this.props.clearQueryResults()
    this.props.addEmptyTable()
  }

  handleJoinClick() {
    console.log(`hey: `, Object.keys(this.props.customQuery[0])[0])
    this.props.getJoinTables(Object.keys(this.props.customQuery[0])[0])

    this.props.addEmptyTable()
  }

  async handleClearTableClick() {
    this.props.clearCustomQuery()
    await this.props.clearQueryResults()
    this.props.addEmptyTable()
    await this.props.clearJoinTables()
  }

  render() {
    const customQuery = this.props.customQuery
    if (customQuery.length) {
      let combineWithStatus = false
      //makes sure one cannot join tables before selecting a table
      for (let i = 0; i < customQuery.length; i++) {
        if (customQuery.length && !Object.keys(customQuery[i])[0]) {
          combineWithStatus = false
          break
        }
        combineWithStatus = true
      }

      return (
        <div className="query-cont">
          <div className="query-table">
            {this.props.customQuery.map((tableObj, idx) => {
              return (
                <div key={idx} className="query-table-cont">
                  {Object.keys(tableObj)[0] ? (
                    <CustomizedQueryTable
                      selectedTable={Object.keys(tableObj)[0]}
                    />
                  ) : (
                    <CustomizedQueryTable />
                  )}
                </div>
              )
            })}
            <button
              className="clear-btn"
              type="button"
              onClick={() => this.handleClearTableClick()}
            >
              Clear Search
            </button>
            <div className="combine-btn">
              {combineWithStatus ? (
                <button type="button" onClick={() => this.handleJoinClick()}>
                  Combine With
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => this.handleJoinClick()}
                  disabled
                >
                  Combine With
                </button>
              )}
            </div>
          </div>
          <div className="submit-query">
            <SubmitQueryButton />
          </div>
        </div>
      )
    } else return null
  }
}

const mapStateToProps = state => {
  return {
    customQuery: state.customizedQuery.customQuery
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addEmptyTable: () => dispatch(addEmptyTable()),
    clearCustomQuery: () => {
      dispatch(clearCustomQuery())
    },
    clearQueryResults: () => {
      dispatch(gotCustomQueryResult([]))
    },
    getJoinTables: selectedTable => {
      dispatch(getJoinTables(selectedTable))
    },
    clearJoinTables: () => {
      dispatch(clearJoinTables())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomizedQueryPage)
