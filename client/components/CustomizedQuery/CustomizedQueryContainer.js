import React, {Component} from 'react'
import CustomizedQueryPage from './CustomizedQueryPage'
import TableResults from './TableResults'

export default class CustomizedQueryContainer extends Component {
  render() {
    return (
      <div className="customized-query-container">
        <CustomizedQueryPage />
        <TableResults />
      </div>
    )
  }
}

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
