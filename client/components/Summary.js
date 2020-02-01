import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

export class Summary extends Component {
  render() {
    return (
      <div>
        <Link to="/newquery">
          <button type="submit">New Query</button>
        </Link>
      </div>
    )
  }
}

// const mapStateToProps = state => {
//   return {
//     email: state.user.email
//   }
// }

// const mapDispatchToProps = () => {}
// export default connect(mapStateToProps, mapDispatchToProps)(Summary)

export default Summary
