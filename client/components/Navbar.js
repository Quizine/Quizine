import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {logout} from '../store'

//BELOW IS MATERIAL UI, ABOVE IS NORMAL REACT
// import Link from '@material-ui/core/Link' //NOT WORKING FOR NOW
import {makeStyles} from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  }
}))

const Navbar = ({handleClick, isLoggedIn}) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Nest Egg
          </Typography>
          {isLoggedIn ? (
            <div>
              {/* The navbar will show these links after you log in */}
              <Link href="/home">
                {' '}
                <Button color="inherit">Home</Button>
              </Link>
              {/* <a href="#" onClick={handleClick}>
                Logout
              </a> */}
              <Link>
                <Button color="inherit" onClick={handleClick}>
                  Logout
                </Button>
              </Link>
            </div>
          ) : (
            <div>
              {/* The navbar will show these links before you log in */}
              <Link to="/login">
                <Button color="inherit">Login</Button>
              </Link>
              <Link to="/signup">
                {' '}
                <Button color="inherit">Signup</Button>
              </Link>
            </div>
          )}
          {/* <Button color="inherit">Login</Button>
          <Button color="inherit">Signup</Button> */}
        </Toolbar>
      </AppBar>
    </div>
  )
}

const mapState = state => {
  return {
    isLoggedIn: !!state.user.id
  }
}

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout())
    }
  }
}

export default connect(mapState, mapDispatch)(Navbar)

/**
 * PROP TYPES
 */
Navbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
