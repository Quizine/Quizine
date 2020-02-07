import React from 'react'

import {Button} from '@material-ui/core'
import {withRouter} from 'react-router-dom'

const Sidebar = props => {
  return (
    <div className="sidebar-container">
      <div className="sidebar-btn">
        {' '}
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          onClick={e => {
            e.preventDefault()
            props.history.push('/summary')
          }}
        >
          Summary
        </Button>
      </div>
      <div className="sidebar-btn">
        {' '}
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          onClick={e => {
            e.preventDefault()
            props.history.push('/businessanalytics')
          }}
        >
          BUSINESS ANALYTICS
        </Button>
      </div>
      <div className="sidebar-btn">
        {' '}
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          onClick={e => {
            e.preventDefault()
            props.history.push('/stockQueries')
          }}
        >
          CUSTOM ANALYTICS
        </Button>
      </div>
    </div>
  )
}

export default withRouter(Sidebar)
