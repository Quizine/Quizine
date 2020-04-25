import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    // width: 150,
    fontWeight: theme.typography.fontWeightMedium
  }
}))

export default function TextButtons() {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Button>Default</Button>
      <Button>Primary</Button>
      <Button>Secondary</Button>
    </div>
    // <List className={clsx(classes.root)}>
    //   <ListItem className={classes.item} disableGutters>
    //     <Button className={classes.button} activeClassName="selected">
    //       Primary Button
    //     </Button>
    //   </ListItem>
    //   <ListItem className={classes.item} disableGutters>
    //     <Button className={classes.button} activeClassName="selected">
    //       Secondary Button
    //     </Button>
    //   </ListItem>
    // </List>
    // // <div>
    // //   <button type="button" selected="false" activeClassName="selected">
    // //     Default
    // //   </button>
    // //   <button type="button" selected="true" activeClassName="selected">
    // //     Primary
    // //   </button>
    // //   <button type="button" selected="false" activeClassName="selected">
    // //     Primary
    // //   </button>
    // // </div>
  )
}
