/* eslint-disable complexity */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import CustomizedQueryTable from './CustomizedQueryTable'
import SubmitQueryButton from './SubmitQueryButton'
import {
  addEmptyTable,
  clearCustomQuery,
  gotCustomQueryResult,
  getJoinTables,
  clearJoinTables,
  addEmptyColumn,
  removeColumn
} from '../../store/customizedQueryReducer'

class CustomizedQueryPage extends Component {
  constructor() {
    super()

    this.handleJoinClick = this.handleJoinClick.bind(this)
    this.handleAddClick = this.handleAddClick.bind(this)
    this.handleRemoveClick = this.handleRemoveClick.bind(this)
  }
  componentDidMount() {
    this.props.clearCustomQuery()
    this.props.clearQueryResults()
    this.props.addEmptyTable()
  }

  handleJoinClick() {
    const customQuery = this.props.customQuery
    // console.log(`hey: `, Object.keys(this.props.customQuery[0])[0])
    this.props.getJoinTables(
      Object.keys(customQuery[customQuery.length - 1])[0]
    )

    this.props.addEmptyTable()
  }

  async handleClearTableClick() {
    this.props.clearCustomQuery()
    await this.props.clearQueryResults()
    this.props.addEmptyTable()
    await this.props.clearJoinTables()
  }

  //LOGIC FOR ADD REMOVE BUTTONS
  handleAddClick() {
    this.props.addEmptyColumn(
      Object.keys(this.props.customQuery[this.props.customQuery.length - 1])[0]
    )
  }

  handleRemoveClick() {
    this.props.removeColumn(
      Object.keys(this.props.customQuery[this.props.customQuery.length - 1])[0]
    )
    const {customQuery} = this.props
    const lastSelectedTable = customQuery.length
      ? Object.keys(customQuery[customQuery.length - 1])[0]
      : null

    const lastSelectedColumn = customQuery.length
      ? customQuery[customQuery.length - 1][lastSelectedTable][
          customQuery[customQuery.length - 1][lastSelectedTable].length - 1
        ]
      : null

    if (!lastSelectedColumn) {
      this.props.addEmptyColumn(
        Object.keys(
          this.props.customQuery[this.props.customQuery.length - 1]
        )[0]
      )
    }
  }
  // END FOR LOGIC

  render() {
    const {customQuery, metaData} = this.props
    if (customQuery.length) {
      //makes sure one cannot join tables before selecting a table
      let combineWithStatus = false

      // if (customQuery.length >= 2) {
      //   combineWithStatus = false
      // } else {
      for (let i = 0; i < customQuery.length; i++) {
        if (customQuery.length && !Object.keys(customQuery[i])[0]) {
          combineWithStatus = false
          break
        }
        combineWithStatus = true
      }
      // }

      //Logic for Add and Remove Buttons
      const lastSelectedTable = customQuery.length
        ? Object.keys(customQuery[customQuery.length - 1])[0]
        : null
      const lastSelectedColumn = customQuery.length
        ? lastSelectedTable &&
          customQuery[customQuery.length - 1][lastSelectedTable][
            customQuery[customQuery.length - 1][lastSelectedTable].length - 1
          ]
        : null

      const columnNumberForLastSelectedTableMetaData =
        lastSelectedTable &&
        columnArrayMapping(lastSelectedTable, metaData).length

      const columnNumberForLastSelectedTableCustomQuery =
        lastSelectedTable &&
        columnArrayMapping(lastSelectedTable, customQuery).length
      //End of logic for Add and Remove Buttons

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
            <div>
              {customQuery.length ? (
                <div className="row-columns">
                  {lastSelectedColumn &&
                  Object.keys(lastSelectedColumn).length ? (
                    <div className="remove-add">
                      {columnNumberForLastSelectedTableMetaData &&
                      columnNumberForLastSelectedTableCustomQuery &&
                      columnNumberForLastSelectedTableCustomQuery <
                        columnNumberForLastSelectedTableMetaData ? (
                        <button
                          type="button"
                          onClick={() => this.handleAddClick()}
                        >
                          Add Search Criteria
                        </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => this.handleRemoveClick()}
                      >
                        Remove Search Criteria
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
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
              ) : null}
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
    customQuery: state.customizedQuery.customQuery,
    metaData: state.customizedQuery.metaData
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
    },
    addEmptyColumn: tableName => {
      dispatch(addEmptyColumn(tableName))
    },
    removeColumn: tableName => {
      dispatch(removeColumn(tableName))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomizedQueryPage)

//Helper functions
function columnArrayMapping(tableName, array) {
  return array.filter(element => {
    return Object.keys(element)[0] === tableName
  })[0][tableName]
}
