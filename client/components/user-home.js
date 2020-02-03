import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Sidebar} from './'
/**
 * COMPONENT
 */
export const UserHome = props => {
  const {email} = props

  return (
    <div className="home-container">
      <div className="sidebar-container">
        <Sidebar />
      </div>
      <h3>Welcome, {email}</h3>
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    email: state.user.email
  }
}

export default connect(mapState)(UserHome)

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  email: PropTypes.string
}
