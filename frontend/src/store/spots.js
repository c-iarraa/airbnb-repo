// - [ DONE ] Create store file for all spots related data (“spots.js”)
// - [ DONE ] Create spotReducer function (state = {}, action) set up switch with default that returns state
// - [ DONE ] In store/index.js, import new spotReducer and set it as the value for a new slice of state called (spots) ex. (Spots: spotReducer)

import csrfFetch from './csrf';

// constants to avoid debugging typos
export const LOAD_SPOTS = "spots/GETALLSPOTS";
export const LOAD_SPECIFIC_SPOT = "spots/GETONESPOT";
export const UPDATE_SPOT = "spots/UPDATESPOT";
export const CREATE_SPOT = "spots/CREATESPOT";
export const REMOVE_SPOT = "spots/REMOVESPOT";
// export const ADD_IMAGE = "spots/ADDIMAGE"


// regular action creators

// const addImg = (image) => ({
//   type: ADD_IMAGE,
//   image
// })

const remove = (spot) => ({
    type: REMOVE_SPOT,
    spot
});

const create = (spot) => ({
    type: CREATE_SPOT,
    payload: spot
});

const update = (spot) => ({
    type: UPDATE_SPOT,
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

// - [ DONE ] Create and Export the Thunk action creator (this is to fetch and parse your data from your backend database)
// Create the action creator to delete a spot
// thunk action creator
export const deleteSpot = (spotId) => async dispatch =>{
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({spotId}),
      })

    if (response.ok){
     // Constant variable to specify the action type (“spots/deleteSpot”)
      const spot = await response.json()
      dispatch(remove(spot))
    }
  }



// Create the action creator to create a spot
// thunk action creator
// export const createSpot = (spotId, url) => async dispatch =>{
//   const response = await csrfFetch(`/api/spots`, {
//       method: 'POST',
//       headers: {'Content-Type': 'application/json'},
//       body: JSON.stringify(spotId),
//     })

//   if (response.ok){
//    // Constant variable to specify the action type (“spots/createSpot”)
//     const spot = await response.json()
//     const res = await csrfFetch(`/api/spots/${spot.id}/images`, {
//       method: "POST",
//       body: JSON.stringify({
//         url,
//         preview: true
//       }),
//     });
//     dispatch(create(spot, url))
//     return spot
//   }
// }

export const createSpot = (newInfo)=> async dispatch => {
  const res = await csrfFetch(`/api/spots`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newInfo)
  })
  if(res.ok){
    const data = await res.json();

    const res2 = await csrfFetch(`/api/spots/${data.id}/images`, {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: newInfo.imageUrl,
      preview: true
    })
  })
  if(res2.ok){
    // data.previewImage = newInfo.imageUrl
    await dispatch(createSpot(data))
    // console.log(data, 'hello')
    return data
  }

  }
}


// Create the action creator to update a spot
// thunk action creator
export const updateSpot = (spotId) => async dispatch =>{
    const response = await csrfFetch(`/api/spots/${spotId.id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(spotId),
      })

    if (response.ok){
     // Constant variable to specify the action type (“spots/updateSpot”)
      const spot = await response.json()
      dispatch(update(spot))
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

  // state object
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
      case CREATE_SPOT: {
        const newState = {...state};
        const allSpotsCopy = {...state.allSpots};
        allSpotsCopy[action.spot.id] = action.spot
        newState.allSpots = allSpotsCopy
        return newState
        // const newState = {...state, allSpots: {...state.allSpots}};
        // if (Array.isArray (action.payload)) {
        //     action.payload.forEach(spot => {
        //         newState.allSpots[spot.id] = spot
        //     })
        // }else {
        //     newState.allSpots[action.payload.id] = action.payload
        //   }
        //   console.log(newState, '12345')
        //   return newState
      }
      case UPDATE_SPOT: {
        const newState = { ...state, allSpots: { ...state.allSpots}}
        newState.allSpots[action.spot.id] = action.spot;
        return newState
      }
      case REMOVE_SPOT: {
        const newState = {...state, allSpots: { ...state.allSpots}}
        delete newState.allSpots[action.id]
        return newState
      }

    default:
      return state;
  }
};

export default spotReducer;
