import React from 'react'
import {Link as RouterLink} from 'react-router-dom'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import {makeStyles} from '@material-ui/styles'
import {Avatar, Typography} from '@material-ui/core'
import {connect} from 'react-redux'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: 'fit-content',
    maxWidth: 150,
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 15
  },
  avatar: {
    width: 75,
    height: 75
  },
  name: {
    marginTop: theme.spacing(1)
  }
}))

const Profile = props => {
  const {className, ...rest} = props

  const classes = useStyles()

  const user = {
    name: `${props.firstName} ${props.lastName}`,
    avatar: props.imgUrl,
    bio: props.title
  }

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <Avatar alt="Person" className={classes.avatar} src={user.avatar} />
      <Typography className={classes.name} variant="h6">
        {user.name}
      </Typography>
      <Typography variant="body2">{user.bio}</Typography>
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    firstName: state.user.firstName,
    lastName: state.user.lastName,
    title: state.user.title,
    imgUrl: state.user.imgUrl
  }
}

export default connect(mapState)(Profile)

Profile.propTypes = {
  className: PropTypes.string
}
