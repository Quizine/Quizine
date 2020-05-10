import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'

const useStyles = makeStyles(theme => ({
  root: {
    marginLeft: '20px',
    marginBottom: '5px'
  },
  button: {
    color: 'grey',
    borderRadius: '0px 0px 0px 0px',
    textTransform: 'none',
    height: '24px',
    borderColor: 'white',
    '&$selected': {
      backgroundColor: 'white',
      color: 'black',
      borderBottomStyle: 'solid',
      borderBottomWidth: '2px',
      borderBottomColor: 'black'
    }
  },
  selected: {}
}))

export default function PopularMenuItemsTopOrBottom5Buttons(props) {
  const classes = useStyles()
  const topGraphOption = props.topGraphOption
  const handleChangeButton = props.handleChangeButton

  const [graphOption, setGraphOption] = React.useState(topGraphOption)

  const handleChange = (event, newGraphOption) => {
    if (newGraphOption !== null) {
      setGraphOption(newGraphOption)
      handleChangeButton(event)
    }
  }

  return (
    <ToggleButtonGroup
      value={graphOption}
      exclusive
      onChange={handleChange}
      className={classes.root}
    >
      <ToggleButton
        classes={{root: classes.button, selected: classes.selected}}
        value={true}
      >
        Top 5 Items
      </ToggleButton>

      <ToggleButton
        classes={{root: classes.button, selected: classes.selected}}
        value={false}
      >
        Bottom 5 Items
      </ToggleButton>
    </ToggleButtonGroup>
  )
}
