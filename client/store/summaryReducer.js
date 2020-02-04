import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_SUMMARY = 'GET_SUMMARY'

/**
 * INITIAL STATE
 */
const initialState = {
  summary: {}
}

/**
 * ACTION CREATORS
 */
const gotSummary = summaryObject => ({type: GET_SUMMARY, summaryObject})

/**
 * THUNK CREATORS
 */
export const getSummary = () => async dispatch => {
  try {
    const res = await axios.get('/api/tables/summary')
    dispatch(gotSummary(res.data))
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function(state = initialState, action) {
  switch (action.type) {
    case GET_SUMMARY:
      return {...state, summary: action.summaryObject}
    default:
      return state
  }
}
