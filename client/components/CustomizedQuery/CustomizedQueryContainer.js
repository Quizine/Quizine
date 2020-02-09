import React, {Component} from 'react'
import CustomizedQueryPage from './CustomizedQueryPage'

export default class CustomizedQueryContainer extends Component {
  render() {
    return (
      <div className="customized-query-container">
        <CustomizedQueryPage />
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
