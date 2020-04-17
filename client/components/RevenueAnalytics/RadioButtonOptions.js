import React from 'react'
import clsx from 'clsx'
import {makeStyles} from '@material-ui/core/styles'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'

const useStyles = makeStyles({
  root: {
    '&:hover': {
      backgroundColor: 'transparent'
    }
  },
  icon: {
    borderRadius: '50%',
    width: 16,
    height: 16,
    boxShadow:
      'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
    backgroundColor: '#f5f8fa',
    backgroundImage:
      'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
    '$root.Mui-focusVisible &': {
      outline: '2px auto rgba(19,124,189,.6)',
      outlineOffset: 2
    },
    'input:hover ~ &': {
      backgroundColor: '#ebf1f5'
    },
    'input:disabled ~ &': {
      boxShadow: 'none',
      background: 'rgba(206,217,224,.5)'
    }
  },
  checkedIcon: {
    backgroundColor: '#137cbd',
    backgroundImage:
      'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
    '&:before': {
      display: 'block',
      width: 16,
      height: 16,
      backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
      content: '""'
    },
    'input:hover ~ &': {
      backgroundColor: '#106ba3'
    }
  }
})

// Inspired by blueprintjs
function StyledRadio(props) {
  const classes = useStyles()

  return (
    <Radio
      className={classes.root}
      disableRipple
      color="default"
      checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
      icon={<span className={classes.icon} />}
      {...props}
    />
  )
}

export default function XAxisOptions(props) {
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Display Data</FormLabel>
      <RadioGroup
        defaultValue="day"
        aria-label="Display Data"
        name="customized-radios"
        onChange={props.handleXAxisOptionChange}
      >
        <FormControlLabel
          value="year"
          control={<StyledRadio />}
          label="Per Year"
        />
        <FormControlLabel
          value="month"
          control={<StyledRadio />}
          label="Per Month"
        />
        <FormControlLabel
          value="week"
          control={<StyledRadio />}
          label="Per Week"
        />
        <FormControlLabel
          value="day"
          control={<StyledRadio />}
          label="Per Day"
        />
        <FormControlLabel
          value="hour"
          control={<StyledRadio />}
          label="Per Hour"
        />
      </RadioGroup>
    </FormControl>
  )
}
