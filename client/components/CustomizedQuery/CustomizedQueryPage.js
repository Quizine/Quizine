import React, {Component} from 'react'
import {connect} from 'react-redux'
import CustomizedQueryTable from './CustomizedQueryTable'

export default class CustomizedQueryPage extends Component {
  constructor() {
    super()
    this.state = {
      count: [1]
    }
    this.handleJoinClick = this.handleJoinClick.bind(this)
  }

  handleJoinClick() {
    this.setState({count: [...this.state.count, 1]})
  }

  render() {
    return (
      <div>
        <div>
          {this.state.count.map((element, index) => {
            return (
              <div key={index}>
                <CustomizedQueryTable />
              </div>
            )
          })}
        </div>
        <div>
          <button type="button" onClick={() => this.handleJoinClick()}>
            ----Join----
          </button>
        </div>
      </div>
    )
  }
}

//   const mapStateToProps = state => {
//     return {
//       tableFields: state.customizedQuery.tableFields
//     }
//   }

//   const mapDispatchToProps = dispatch => {
//     return {
//       loadTableFields: tableName => {
//         dispatch(getTableFields(tableName))
//       }
//     }
//   }
//   export default connect(mapStateToProps, mapDispatchToProps)(CustomizedQuery)
