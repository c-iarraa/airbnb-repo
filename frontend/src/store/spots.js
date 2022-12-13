// - [ DONE ] Create store file for all spots related data (“spots.js”)
// - [ DONE ] Create spotReducer function (state = {}, action) set up switch with default that returns state
// - [ DONE ] In store/index.js, import new spotReducer and set it as the value for a new slice of state called (spots) ex. (Spots: spotReducer)

export const LOAD_SPOTS = "spots/GETALLSPOTS";

const load = (spots) => ({
  type: LOAD_SPOTS,
  spots,
});

// - [ DONE ] Create and Export the Thunkalicious action creator (this is to fetch and parse your data from your backend database)
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

const initialState = {};

const spotReducer = (state = initialState, action) => {
  switch (action.type) {
      // Create a case in your reducer to handle the data returned from fetch/parse
    case LOAD_SPOTS:
      const newSpots = {};
      action.spots.Spots.forEach(spot => {
        newSpots[spot.id] = spot;
      })
      return newSpots;

    default:
      return state;
  }
};

export default spotReducer;
