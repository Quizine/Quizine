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

export default function AggOptions(props) {
  const selectedQueryTitle = props.selectedQueryTitle
  const selectedAggOption = props.selectedAggOption
  const handleAggOptionChange = props.handleAggOptionChange

  return (
    <FormControl component="fieldset" className="agg-options">
      {/* <FormLabel component="legend"></FormLabel> */}
      <h3 style={{marginBottom: '10px'}}>Performance Metric:</h3>
      <RadioGroup
        defaultValue="sum"
        value={selectedAggOption}
        aria-label="Aggregate Option"
        onChange={handleAggOptionChange}
      >
        <FormControlLabel
          value="sum"
          control={<StyledRadio />}
          label={
            selectedQueryTitle === 'detailedRevenueAnalysis'
              ? 'Total Revenue'
              : 'Total Number Of Menu Items'
          }
        />
        <FormControlLabel
          value="avg"
          control={<StyledRadio />}
          label={
            selectedQueryTitle === 'detailedRevenueAnalysis'
              ? 'Average Revenue Per Table Served'
              : 'Average Number Of Menu Items Per Table Served'
          }
        />
        <FormControlLabel
          value={
            selectedQueryTitle === 'detailedRevenueAnalysis'
              ? 'avgRevenuePerGuest'
              : 'numberOfOrders'
          }
          control={<StyledRadio />}
          label={
            selectedQueryTitle === 'detailedRevenueAnalysis'
              ? 'Average Revenue Per Guest'
              : 'Total Number Of Tables Served'
          }
        />
      </RadioGroup>
    </FormControl>
  )
}
