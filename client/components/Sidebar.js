import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import DashboardIcon from '@material-ui/icons/Dashboard'
import FunctionsIcon from '@material-ui/icons/Functions'
import InsertChartOutlinedIcon from '@material-ui/icons/InsertChartOutlined'
import SidebarNav from './SidebarNav'
import UserProfile from './UserProfile'
import {me} from '../store/userReducer'

const pages = [
  {
    title: 'SUMMARY',
    href: '/summary',
    icon: <DashboardIcon />
  },
  {
    title: 'BUSINESS ANALYTICS',
    href: '/businessanalytics',
    icon: <InsertChartOutlinedIcon />
  },
  {
    title: 'CUSTOM ANALYTICS',
    href: '/customizedQuery',
    icon: <FunctionsIcon />
  }
]

const Sidebar = () => {
  return (
    <div className="sidebar-container">
      <UserProfile />
      <SidebarNav pages={pages} />
    </div>
  )
}

export default withRouter(Sidebar)
