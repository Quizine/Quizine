import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_FIELDS = 'GET_FIELDS'

// /**
//  * INITIAL STATE
//  */
// const initialState = {
// //   rows: [],
//   fields: []
// }

// /**
//  * ACTION CREATORS
//  */
// const gotSummary = summary => ({type: GET_SUMMARY, summary})

// /**
//  * THUNK CREATORS
//  */
// export const getSummary = () => async dispatch => {
//   try {
//     const res = await axios.get('/api/tables/summary')
//     dispatch(gotSummary(res.data))
//   } catch (err) {
//     console.error(err)
//   }
// }

// /**
//  * REDUCER
//  */
// export default function(state = initialState, action) {
//   switch (action.type) {
//     case GET_SUMMARY:
//       return {
//         ...state
//         // rows: action.menu.rows,
//         // fields: filterFieldsFunction(action.menu.fields)   ?????
//       }
//     default:
//       return state
//   }
// }
