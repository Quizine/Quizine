import axios from 'axios'
import {object} from 'prop-types'

const GET_AVG_REVENUE_GUEST_VS_DOW = 'GET_AVG_REVENUE_GUEST_VS_DOW'
const GET_MONTHLY_REVENUE_VS_LUNCH_VS_DINNER =
  'GET_MONTHLY_REVENUE_VS_LUNCH_VS_DINNER'

const initialState = {
  avgRevenuePerGuestVsDOW: {
    year: [],
    month: [],
    week: []
  },
  monthlyRevenueVsLunchVsDinner: {
    allPeriod: {},
    oneYear: {},
    twoYears: {}
  }
}

const gotAvgRevenuePerGuestVsDOW = (results, timeInterval) => ({
  type: GET_AVG_REVENUE_GUEST_VS_DOW,
  results,
  timeInterval
})

const gotMonthlyRevenueVsLunchVsDinner = (chartData, yearQty) => ({
  type: GET_MONTHLY_REVENUE_VS_LUNCH_VS_DINNER,
  chartData,
  yearQty
})

export const getAvgRevenuePerGuestVsDOW = timeInterval => async dispatch => {
  try {
    const {data} = await axios.get(
      '/api/revenueAnalytics/avgRevenuePerGuestVsDOW',
      {
        params: {timeInterval}
      }
    )
    dispatch(gotAvgRevenuePerGuestVsDOW(data, timeInterval))
  } catch (err) {
    console.error(err)
  }
}

export const getMonthlyRevenueVsLunchVsDinner = yearQty => async dispatch => {
  let sendYear
  if (yearQty === 'oneYear') sendYear = '1'
  else if (yearQty === 'twoYears') sendYear = '2'
  else sendYear = '3'
  try {
    const {data} = await axios.get(
      '/api/revenueAnalytics/monthlyRevenueVsLunchVsDinner',
      {
        params: {year: sendYear}
      }
    )
    dispatch(gotMonthlyRevenueVsLunchVsDinner(data, yearQty))
  } catch (error) {
    console.error(error)
  }
}

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_AVG_REVENUE_GUEST_VS_DOW:
      return {
        ...state,
        avgRevenuePerGuestVsDOW: {
          ...state.avgRevenuePerGuestVsDOW,
          [`${action.timeInterval}`]: action.results
        }
      }
    case GET_MONTHLY_REVENUE_VS_LUNCH_VS_DINNER:
      return {
        ...state,
        monthlyRevenueVsLunchVsDinner: {
          ...state.monthlyRevenueVsLunchVsDinner,
          [`${action.yearQty}`]: action.chartData
        }
      }
    default:
      return state
  }
}
