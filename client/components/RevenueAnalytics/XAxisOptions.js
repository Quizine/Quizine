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

// eslint-disable-next-line complexity
export default function XAxisOptions(props) {
  const oneDay = 24 * 60 * 60 * 1000 // hours*minutes*seconds*milliseconds
  const startDate = new Date(props.revenueQueryResults.startDate)
  const endDate = new Date(props.revenueQueryResults.endDate)
  const diffDays = Math.floor(Math.abs((startDate - endDate) / oneDay))
  const xAxisOption = props.selectedXAxisOption
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Display Data</FormLabel>
      <RadioGroup
        defaultValue="day"
        value={xAxisOption}
        aria-label="Display Data"
        name="customized-radios"
        onChange={props.handleXAxisOptionChange}
      >
        <FormControlLabel
          value="year"
          disabled={diffDays <= 365}
          control={<StyledRadio />}
          label="Per Year"
        />
        <FormControlLabel
          value="month"
          disabled={diffDays <= 30}
          control={<StyledRadio />}
          label="Per Month"
        />
        <FormControlLabel
          value="week"
          disabled={diffDays <= 7}
          control={<StyledRadio />}
          label="Per Week"
        />
        <FormControlLabel
          value="day"
          disabled={false}
          control={<StyledRadio />}
          label="Per Day"
        />
        <FormControlLabel
          value="hour"
          disabled={diffDays >= 365}
          control={<StyledRadio />}
          label="Per Hour"
        />
        {props.selectedQueryTitle === 'avgRevenuePerGuest' ? (
          <FormControlLabel
            value="DOW"
            control={<StyledRadio />}
            label="Average Per Day Of Week"
          />
        ) : null}
        {props.selectedQueryTitle === 'numberOfOrders' ? (
          <FormControlLabel
            value="avgHour"
            control={<StyledRadio />}
            label="Average Per Hour"
          />
        ) : null}
      </RadioGroup>
    </FormControl>
  )
}
