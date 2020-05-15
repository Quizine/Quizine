import React from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import {makeStyles} from '@material-ui/styles'
import {Card, CardContent, Grid, Typography, Avatar} from '@material-ui/core'
import StarIcon from '@material-ui/icons/Star'
import Rating from '@material-ui/lab/Rating'
import Box from '@material-ui/core/Box'

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
    backgroundColor: theme.palette.warning.light,
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

const YelpRating = props => {
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
              YELP RATING
            </Typography>
            <Box component="fieldset" mb={3} borderColor="transparent">
              <Typography variant="h6">
                {props.yelpRating.toFixed(1)}/5.0
              </Typography>
              <Rating name="yelp-rating" value={props.yelpRating} readOnly />
            </Box>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <StarIcon className={classes.icon} />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default YelpRating
