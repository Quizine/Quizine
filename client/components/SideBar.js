import React, {Component} from 'react'
import {Link} from 'react-router-dom'

export class SideBar extends Component {
  render() {
    return (
      <div>
        <Link to="/summary">Business Summary</Link>
        <Link to="/savedqueries">Saved Queries</Link>
      </div>
    )
  }
}

export default SideBar
