import axios from 'axios'

const GET_PEAK_TIME_ORDERS = 'GET_PEAK_TIME_ORDERS'

const initialState = {
  year: [],
  month: [],
  week: []
}

const gotOrders = orders => ({type: GET_PEAK_TIME_ORDERS, orders})

export const getPeakTimeOrders = () => async dispatch => {
  try {
    const year = await axios.get('/api/orders/searchlast', {
      params: {interval: 'year'}
    })
    const month = await axios.get('/api/orders/searchlast', {
      params: {interval: 'month'}
    })
    const week = await axios.get('/api/orders/searchlast', {
      params: {interval: 'week'}
    })
    dispatch(
      gotOrders({
        year: year.data,
        month: month.data,
        week: week.data
      })
    )
  } catch (err) {
    console.error(err)
  }
}

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_PEAK_TIME_ORDERS:
      return action.orders
    default:
      return state
  }
}
