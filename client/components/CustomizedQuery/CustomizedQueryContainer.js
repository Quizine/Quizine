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
