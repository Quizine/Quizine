import React from 'react'
import {withRouter} from 'react-router-dom'
import DashboardIcon from '@material-ui/icons/Dashboard'
import PeopleIcon from '@material-ui/icons/People'
import FunctionsIcon from '@material-ui/icons/Functions'
import LocalAtmIcon from '@material-ui/icons/LocalAtm'
import SidebarNav from './SidebarNav'
import UserProfile from './UserProfile'

const pages = [
  {
    title: 'SUMMARY',
    href: '/summary',
    icon: <DashboardIcon />
  },
  {
    title: 'REVENUE ANALYTICS',
    href: '/revenueanalytics',
    icon: <LocalAtmIcon />
  },
  {
    title: 'STAFF ANALYTICS',
    href: '/staffAnalytics',
    icon: <PeopleIcon />
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
      <div className="sidebar-nav-cont">
        <UserProfile />
        <SidebarNav pages={pages} />
      </div>
    </div>
  )
}

export default withRouter(Sidebar)
