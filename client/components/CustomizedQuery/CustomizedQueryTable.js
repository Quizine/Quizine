import React, {Component} from 'react'
import {connect} from 'react-redux'
import {
  getTableFields,
  addTable,
  getTableNames,
  clearCustomQuery
} from '../../store/customizedQueryReducer'
import CustomizedQuerySelect from './CustomizedQuerySelect'
import _ from 'lodash'

export class CustomizedQueryTable extends Component {
  constructor() {
    super()
    this.state = {
      selectedTable: '',
      count: [1],
      disabled: false, //USED!!! DO NOT DELETE
      defaultValue: 'default' //USED!!! DO NOT DELETE
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleAddClick = this.handleAddClick.bind(this)
    this.handleRemoveClick = this.handleRemoveClick.bind(this)
    this.handleClearTableClick = this.handleClearTableClick.bind(this)
  }

  componentDidMount() {
    this.props.loadTableNames()
  }

  handleChange(event) {
    this.props.loadTableFields(event.target.value)

    this.setState({
      selectedTable: event.target.value
    })

    this.props.updateCustomQuery(event.target.value)

    this.setState({
      //USED!!! DO NOT DELETE
      ...this.state,
      disabled: true,
      defaultValue: event.target.value
    })
    event.target.disabled = true
  }

  handleAddClick() {
    this.setState({count: [...this.state.count, 1]})
  }

  handleClearTableClick() {
    this.props.clearCustomQuery()
    this.setState({...this.state, disabled: false, defaultValue: 'default'}) //USED!!! DO NOT DELETE
  }

  handleRemoveClick() {
    let updatedState = [...this.state.count]
    updatedState.pop()
    this.setState({count: updatedState})
  }
  render() {
    // console.log('TABLE PROPS', this.props)
    // console.log('TABLE STATE', this.state)

    const {tableNames, customQuery} = this.props

    return (
      <div className="custom-analytics-container">
        <select
          onChange={() => this.handleChange(event)}
          disabled={this.state.disabled}
          value={this.state.defaultValue}
        >
          <option value="default">Please Select</option>

          {tableNames.map((element, idx) => {
            return (
              <option value={element} key={idx}>
                {_.capitalize(element)}
              </option>
            )
          })}
        </select>
        <button type="button" onClick={() => this.handleClearTableClick()}>
          Clear Query
        </button>
        <div>
          {customQuery && customQuery.length ? (
            <div>
              <CustomizedQuerySelect
                selectedTable={
                  Object.keys(customQuery[customQuery.length - 1])[0]
                }
              />
              <button type="button" onClick={() => this.handleAddClick()}>
                Add
              </button>
              {/* ) : null} */}
              {/* {this.state.count.length ? ( */}
              <button type="button" onClick={() => this.handleRemoveClick()}>
                Remove
              </button>
              {/* <CustomizedQuerySelect
                selectedTable={
                  Object.keys(customQuery[customQuery.length - 1])[0]
                }
              /> */}
            </div>
          ) : null}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    tableNames: state.customizedQuery.metaData.map(element => {
      return Object.keys(element)[0]
    }),
    tableFields: state.customizedQuery.tableFields,
    customQuery: state.customizedQuery.customQuery
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadTableNames: () => {
      dispatch(getTableNames())
    },
    loadTableFields: tableName => {
      dispatch(getTableFields(tableName))
    },
    updateCustomQuery: queryObject => {
      dispatch(addTable(queryObject))
    },
    clearCustomQuery: () => {
      dispatch(clearCustomQuery())
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(
  CustomizedQueryTable
)

function columnNameMapping(tableName, array) {
  return array
    .filter(element => {
      return Object.keys(element)[0] === tableName
    })[0]
    [tableName].map(element => {
      return Object.keys(element)[0]
    })
}

// import React, {Component} from 'react'
// import {connect} from 'react-redux'
// import {getTableFields} from '../../store/customizedQueryReducer'
// import CustomizedQuerySelect from './CustomizedQuerySelect'
// import CustomizedQueryJoin from './CustomizedQueryJoin'

// export class CustomizedQueryPage extends Component {
//   constructor() {
//     super()
//     this.state = {
//       selectedTable: '',
//       count: [1]
//     }
//     this.handleChange = this.handleChange.bind(this)
//     this.handleAddClick = this.handleAddClick.bind(this)
//     this.handleRemoveClick = this.handleRemoveClick.bind(this)
//   }

//   handleChange(event) {
//     this.props.loadTableFields(event.target.value)
//     this.setState({selectedTable: event.target.value})
//   }

//   handleAddClick() {
//     this.setState({count: [...this.state.count, 1]})
//   }

//   handleRemoveClick() {
//     let updatedState = [...this.state.count]
//     updatedState.pop()
//     this.setState({count: updatedState})
//   }
//   render() {
//     const selectedTable = this.state.selectedTable
//     const selectedColumns = this.props.tableFields
//     return (
//       <div className="custom-analytics-container">
//         <select onChange={() => this.handleChange(event)}>
//           <option>Please Select</option>
//           <option value="menus">Menu</option>
//           <option value="waiters">Waiters</option>
//           <option value="orders">Orders</option>
//         </select>
//         <div>
//           {/* {selectedTable ? (
//             <CustomizedQueryJoin selectedTable={selectedTable} />
//           ) : null} */}
//           {selectedColumns.length ? (
//             <div>
//               <div>
//                 {this.state.count.map((element, index) => {
//                   return (
//                     <div key={index}>
//                       <CustomizedQuerySelect
//                         selectedTable={selectedTable}
//                         columnNames={selectedColumns}
//                       />
//                     </div>
//                   )
//                 })}
//               </div>
//               {this.state.count.length < selectedColumns.length ? (
//                 <button type="button" onClick={() => this.handleAddClick()}>
//                   Add
//                 </button>
//               ) : null}
//               {this.state.count.length ? (
//                 <button type="button" onClick={() => this.handleRemoveClick()}>
//                   Remove
//                 </button>
//               ) : null}
//             </div>
//           ) : null}
//         </div>
//         <div>
//           <button type="button">Join</button>
//         </div>
//       </div>
//     )
//   }
// }

// const mapStateToProps = state => {
//   return {
//     tableFields: state.customizedQuery.tableFields
//   }
// }

// const mapDispatchToProps = dispatch => {
//   return {
//     loadTableFields: tableName => {
//       dispatch(getTableFields(tableName))
//     }
//   }
// }
// export default connect(mapStateToProps, mapDispatchToProps)(CustomizedQueryPage)
