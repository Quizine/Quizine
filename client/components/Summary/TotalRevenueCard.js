import React from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import {makeStyles} from '@material-ui/styles'
import {Card, CardContent, Grid, Typography, Avatar} from '@material-ui/core'
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn'

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
    backgroundColor: theme.palette.error.main,
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
    color: theme.palette.error.dark
  },
  differenceValue: {
    color: theme.palette.error.dark,
    marginRight: theme.spacing(1)
  }
}))

const TotalRevenue = props => {
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
              TOTAL REVENUE
            </Typography>
            <Typography variant="h5">$ {props.totalRevenue} K</Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <MonetizationOnIcon className={classes.icon} />
            </Avatar>
          </Grid>
        </Grid>
        <div className={classes.difference}>
          <Typography className={classes.caption} variant="caption">
            for the last year
          </Typography>
        </div>
      </CardContent>
    </Card>
  )
}

export default TotalRevenue
