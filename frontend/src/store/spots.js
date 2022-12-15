// - [ DONE ] Create store file for all spots related data (“spots.js”)
// - [ DONE ] Create spotReducer function (state = {}, action) set up switch with default that returns state
// - [ DONE ] In store/index.js, import new spotReducer and set it as the value for a new slice of state called (spots) ex. (Spots: spotReducer)

import csrfFetch from './csrf';

export const LOAD_SPOTS = "spots/GETALLSPOTS";
export const LOAD_SPECIFIC_SPOT = "spots/GETONESPOT";
export const EDIT_SPOT = "spots/EDITSPOT";
export const CREATE_SPOT = "spots/CREATESPOT";
export const REMOVE_SPOT = "spots/REMOVESPOT";

const remove = (spot) => ({
    type: REMOVE_SPOT,
    spot
});

const create = (spot) => ({
    type: CREATE_SPOT,
    payload: spot
});

const edit = (spot) => ({
    type: EDIT_SPOT,
    spot
});

const loadSpecificSpot = (oneSpot) => ({
    type: LOAD_SPECIFIC_SPOT,
    oneSpot
});

const load = (spotList) => ({
  type: LOAD_SPOTS,
  spotList,
});

// - [ DONE ] Create and Export the Thunkalicious action creator (this is to fetch and parse your data from your backend database)
// Create the action creator to delete a spot
// thunk action creator
export const deleteSpot = (spotId) => async dispatch =>{
    const response = await csrfFetch(`/api/spots`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(spotId),
      })

    if (response.ok){
     // Constant variable to specify the action type (“spots/deleteSpot”)
      const spot = await response.json()
      dispatch(remove(spot))
    }
  }



// Create the action creator to create a spot
// thunk action creator
export const createSpot = (spotId) => async dispatch =>{
  const response = await csrfFetch(`/api/spots`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(spotId),
    })

  if (response.ok){
   // Constant variable to specify the action type (“spots/createSpot”)
    const spot = await response.json()
    dispatch(create(spot))
    return spot
  }
}



// Create the action creator to edit a spot
// thunk action creator
export const editSpot = (spotId) => async dispatch =>{
    const response = await csrfFetch(`/api/spots/${spotId.id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(spotId),
      })

    if (response.ok){
     // Constant variable to specify the action type (“spots/editSpot”)
      const spot = await response.json()
      dispatch(edit(spot))
      return spot
    }
  }


// Create the action creator for one spot
// thunk action creator
export const getSpot = (spotId) => async dispatch =>{
  const response = await fetch(`/api/spots/${spotId}`)

  if (response.ok){
     // Constant variable to specify the action type (“spots/getOneSpot”)
    const spot = await response.json()
    dispatch(loadSpecificSpot(spot))
  }
}


// Create the action creator for all spots
// thunk action creator
export const getSpots = () => async (dispatch) =>{
    const response = await fetch(`/api/spots`)

    if (response.ok){
     // Constant variable to specify the action type (“spots/getAllSpots”)
      const spots = await response.json()
      dispatch(load(spots))
      return spots
    }
  }

const initialState = { allSpots: {}, oneSpot: {} };

const spotReducer = (state = initialState, action) => {
  switch (action.type) {
      // Create a case in your reducer to handle the data returned from fetch/parse
    case LOAD_SPOTS:{
      const newState = { allSpots: {}, oneSpot: {} };
            action.spotList.Spots.forEach(spot => newState.allSpots[spot.id] = spot);
            return newState;
        }

      case LOAD_SPECIFIC_SPOT: {
        const newState = { ...state, oneSpot: {} };
            newState.oneSpot = action.oneSpot
            return newState
        }

      // case CREATE_SPOT:{
      //   const newState = { ...state, allSpots: { ...state.allSpots }}
      //     if (Array.isArray(action.payload)) {
      //       action.payload.forEach(spot => {
      //         newState.allSpots[spot.it] = spot;
      //       })
      //     } else {
      //       newState.allSpots[action.payload.id] = action.payload;
      //     }
      //     return newState;

      // }

      case CREATE_SPOT: {
        const newState = {...state, allSpots: {...state.allSpots}};
        if (Array.isArray (action.payload)) {
            action.payload.forEach(spot => {
                newState.allSpots[spot.id] = spot
            })
        }else {
            newState.allSpots[action.payload.id] = action.payload
        }
            return newState
      }
      // case EDIT_SPOT:


      // case REMOVE_SPOT:

    default:
      return state;
  }
};

export default spotReducer;
