import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_ORDERS = 'GET_ORDERS'

/**
 * INITIAL STATE
 */
const initialState = {
  rows: [],
  fields: []
}

/**
 * ACTION CREATORS
 */
const gotOrders = orders => ({type: GET_ORDERS, orders})

/**
 * THUNK CREATORS
 */
export const getOrders = () => async dispatch => {
  try {
    const res = await axios.get('/api/orders')
    dispatch(gotOrders(res.data))
  } catch (err) {
    console.error(err)
  }
}

const filterFieldsFunction = function(array) {
  return array
    .filter(
      field =>
        field.name !== 'id' &&
        field.name !== 'createdAt' &&
        field.name !== 'updatedAt' &&
        !field.name.includes('Id')
    )
    .map(field => field.name)
}

/**
 * REDUCER
 */
export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ORDERS:
      return {
        ...state,
        rows: action.orders.rows,
        fields: filterFieldsFunction(action.orders.fields)
      }
    default:
      return state
  }
}
