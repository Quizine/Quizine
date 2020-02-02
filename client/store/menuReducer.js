import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_MENU = 'GET_MENU'

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
const gotMenu = menu => ({type: GET_MENU, menu})

/**
 * THUNK CREATORS
 */
export const getMenu = () => async dispatch => {
  try {
    const res = await axios.get('/api/menu')
    dispatch(gotMenu(res.data))
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
    case GET_MENU:
      return {
        ...state,
        rows: action.menu.rows,
        fields: filterFieldsFunction(action.menu.fields)
      }
    default:
      return state
  }
}
