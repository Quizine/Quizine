// import React, {Component} from 'react'
// import {connect} from 'react-redux'
// import {getTableFields, getJoinTables} from '../../store/customizedQueryReducer'
// import CustomizedQuerySelect from './CustomizedQuerySelect'

// export class CustomizedQueryJoin extends Component {
//   constructor() {
//     super()
//     this.state = {
//       selectedJoinTable: '',
//       count: [1]
//     }
//     this.handleChange = this.handleChange.bind(this)
//     this.handleAddClick = this.handleAddClick.bind(this)
//     this.handleRemoveClick = this.handleRemoveClick.bind(this)
//   }
//   componentDidMount() {
//     this.props.loadJoinTables(this.props.selectedTable)
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
//     const selectedJoinTable = this.state.selectedJoinTable
//     const selectedColumns = this.props.tableFields
//     const joinTables = this.props.joinTables
//     return (
//       <div className="custom-analytics-container">
//         {joinTables ? (
//           <div>
//             <select onChange={() => this.handleChange(event)}>
//               <option>Please Select</option>
//               {joinTables.map((table, index) => {
//                 return (
//                   <option key={index} value={table.foreign_table_name}>
//                     {table.foreign_table_name}
//                   </option>
//                 )
//               })}
//             </select>
//           </div>
//         ) : null}
//         <div>
//           {selectedColumns.length ? (
//             <div>
//               <div>
//                 {this.state.count.map((element, index) => {
//                   return (
//                     <div key={index}>
//                       <CustomizedQuerySelect
//                         selectedJoinTable={selectedJoinTable}
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
//       </div>
//     )
//   }
// }

// const mapStateToProps = state => {
//   return {
//     tableFields: state.customizedQuery.tableFields,
//     joinTables: state.customizedQuery.joinTables
//   }
// }

// const mapDispatchToProps = dispatch => {
//   return {
//     loadTableFields: tableName => {
//       dispatch(getTableFields(tableName))
//     },
//     loadJoinTables: tableName => {
//       dispatch(getJoinTables(tableName))
//     }
//   }
// }
// export default connect(mapStateToProps, mapDispatchToProps)(CustomizedQueryJoin)
