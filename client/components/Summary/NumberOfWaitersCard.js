// import React, {Component} from 'react'
// import {connect} from 'react-redux'
// import {getNumberOfWaiters} from '../../store/summaryReducer'

// export class NumberOfWaiters extends Component {
//   componentDidMount() {
//     this.props.loadNumOfWaiters()
//   }

//   render() {
//     return (
//       <div>
//         <h2>You have currently {this.props.numOfWaiters} in your restaurant</h2>
//       </div>
//     )
//   }
// }

// const mapStateToProps = state => {
//   return {
//     numOfWaiters: state.summary.numberOfWaiters
//   }
// }

// const MapDispatchToProps = dispatch => {
//   return {
//     loadNumOfWaiters: () => dispatch(getNumberOfWaiters())
//   }
// }

// export default connect(mapStateToProps, MapDispatchToProps)(NumberOfWaiters)

import React from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import {makeStyles} from '@material-ui/styles'
import {Card, CardContent, Grid, Typography, Avatar} from '@material-ui/core'
import PeopleIcon from '@material-ui/icons/PeopleOutlined'

const useStyles = makeStyles(theme => ({
  root: {
    height: '85%',
    width: '90%'
  },
  content: {
    alignItems: 'center',
    display: 'flex'
  },
  title: {
    fontWeight: 700
  },
  avatar: {
    backgroundColor: theme.palette.success.main,
    height: 50,
    width: 50
  },
  icon: {
    height: 32,
    width: 32
  },
  difference: {
    marginTop: theme.spacing(2),
    display: 'flex',
    alignItems: 'center'
  },
  differenceIcon: {
    color: theme.palette.success.dark
  },
  differenceValue: {
    color: theme.palette.success.dark,
    marginRight: theme.spacing(1)
  }
}))

const NumberOfWaiters = props => {
  const {className, ...rest} = props

  const classes = useStyles()

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardContent>
        <Grid container justify="space-between">
          <Grid item>
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom
              variant="body2"
            >
              TOTAL STAFF NUMBER
            </Typography>
            <Typography variant="h5">100</Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <PeopleIcon className={classes.icon} />
            </Avatar>
          </Grid>
        </Grid>
        <div className={classes.difference}>
          <Typography className={classes.caption} variant="caption">
            currently working
          </Typography>
        </div>
      </CardContent>
    </Card>
  )
}

export default NumberOfWaiters
