import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import PeakTimeGraph from './D3/PeakTimeGraph'

export class Summary extends Component {
  render() {
    return (
      <div>
        <Link to="/newquery">
          <button type="submit">New Query</button>
        </Link>
        <PeakTimeGraph />
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
