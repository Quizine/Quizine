import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row'
    // width: 150,
    //fontWeight: theme.typography.fontWeightMedium
  }
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
    <ToggleButtonGroup value={graphOption} exclusive onChange={handleChange}>
      <ToggleButton value="bar">Bar Graph</ToggleButton>
      <ToggleButton value="line">Line Graph</ToggleButton>
    </ToggleButtonGroup>
  )
}
