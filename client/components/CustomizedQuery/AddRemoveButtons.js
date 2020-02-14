import React, {Component} from 'react'

export class AddRemoveButtons extends Component {
  constructor(props) {
    super(props)

    this.state = {
      toShow: false
    }
  }

  componentDidMount() {
    const {customQuery, selectedTable, lastSelectedColumn} = this.props
    let lastSelectedColumnName
    if (lastSelectedColumn) {
      lastSelectedColumnName = Object.keys(lastSelectedColumn)[0]
    }
    this.setState({
      toShow: showAddButton(customQuery, selectedTable, lastSelectedColumnName)
    })
  }

  render() {
    const {
      lastSelectedColumn,
      columnNumberForLastSelectedTable,
      columnNumberForLastSelectedTableTEST
    } = this.props
    console.log('ADAMS STATE', this.state.toShow)
    return (
      <div>
        <h2>ADAM ARE U HERE?</h2>
        {this.state.toShow ? (
          <div>
            {lastSelectedColumn && Object.keys(lastSelectedColumn).length ? (
              <div className="remove-add">
                {columnNumberForLastSelectedTable &&
                columnNumberForLastSelectedTableTEST &&
                columnNumberForLastSelectedTableTEST <
                  columnNumberForLastSelectedTable ? (
                  <button
                    type="button"
                    onClick={() => this.props.handleAddClick()}
                  >
                    Add Search Criteria
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => this.props.handleRemoveClick()}
                >
                  Remove Search Criteria
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    )
  }
}

export default AddRemoveButtons

function showAddButton(customQuery, tableName, columnName) {
  const lastTable = customQuery[customQuery.length - 1]
  const lastTableName = Object.keys(lastTable)[0]
  if (lastTableName === tableName) {
    const columnName2 = Object.keys(lastTable)[0]
    const arrOfOptions = lastTable[columnName2]
    const lastOption = arrOfOptions[arrOfOptions.length - 1]
    const lastOptionName = Object.keys(lastOption)[0]
    if (columnName) {
      if (lastOptionName === columnName) {
        console.log("I'M AT THE FINAL")
        return true
      }
    }
  }
  return false
}
