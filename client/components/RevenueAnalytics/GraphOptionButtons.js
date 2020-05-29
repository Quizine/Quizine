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

export default function GraphOptionButtons(props) {
  const classes = useStyles()
  const handleGraphOptionChange = props.handleGraphOptionChange
  const selectedQueryTitle = props.selectedQueryTitle
  const selectedGraphOption = props.selectedGraphOption

  const [graphOption, setGraphOption] = React.useState(selectedGraphOption)

  const handleChange = (event, newGraphOption) => {
    if (newGraphOption !== null) {
      setGraphOption(newGraphOption)
      handleGraphOptionChange(event)
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
        value="bar"
      >
        Bar Graph
      </ToggleButton>
      {selectedQueryTitle === 'lunchAndDinnerRevenueComparison' ? (
        <ToggleButton
          classes={{root: classes.button, selected: classes.selected}}
          value="stacked bar"
        >
          Stacked Bar Graph
        </ToggleButton>
      ) : null}
      <ToggleButton
        classes={{root: classes.button, selected: classes.selected}}
        value="line"
      >
        Line Graph
      </ToggleButton>
    </ToggleButtonGroup>
  )
}
