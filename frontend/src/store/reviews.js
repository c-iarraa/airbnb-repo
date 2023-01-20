// - [ DONE ] Create store file for all spots related data (“spots.js”)
// - [ DONE ] Create spotReducer function (state = {}, action) set up switch with default that returns state
// - [ DONE ] In store/index.js, import new spotReducer and set it as the value for a new slice of state called (spots) ex. (Spots: spotReducer)

import csrfFetch from './csrf';

// constants to avoid debugging typos
export const LOAD_REVIEWS = "spots/GETALLREVIEWS";
export const CREATE_REVIEW = "spots/CREATEREVIEW";
export const REMOVE_REVIEW = "spots/REMOVEREVIEW";


// regular action creators
const remove = (reviewId) => ({
    type: REMOVE_REVIEW,
    reviewId
});

const create = (review) => ({
    type: CREATE_REVIEW,
    review
});

const load = (reviewList) => ({
  type: LOAD_REVIEWS,
  reviewList,
});

// - [ DONE ] Create and Export the Thunk action creator (this is to fetch and parse your data from your backend database)
// Create the action creator to delete a review
// thunk action creator
export const deleteReview = (reviewId) => async dispatch =>{
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
        // headers: {'Content-Type': 'application/json'},
        // body: JSON.stringify({reviewId}),
    })

    if (response.ok){
     // Constant variable to specify the action type (“spots/deleteReview”)
      const review = await response.json()
      dispatch(remove(review))
    }
  }



// Create the action creator to create a review
// thunk action creator
export const createReview = (spotId, review) => async dispatch => {
    console.log('@@@', review)
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(review),
    })

  if (response.ok){
   // Constant variable to specify the action type (“spots/createReview”)
    const review = await response.json()
    dispatch(create(review))
    return review;
  }
}


// Create the action creator for all spots
// thunk action creator
export const getReviews = (spotId) => async (dispatch) =>{
    const response = await fetch(`/api/spots/${spotId}/reviews`)

    if (response.ok){
     // Constant variable to specify the action type (“spots/getAllSpots”)
      const reviews = await response.json()
      dispatch(load(reviews))
      // return reviews
    }
  }

  // state object
// const initialState = { allReviews: {} };
// const reviewReducer = (state = initialState, action) => {
//   switch (action.type) {
//       // Create a case in your reducer to handle the data returned from fetch/parse
//     case LOAD_REVIEWS:{
//       const newState = { allReviews: {} };
//             action.reviewList.Reviews.forEach(review => newState.allReviews[review.id] = review);
//             return newState;
//         }

//       case CREATE_REVIEW: {
  //         return {
    //             ...state, allReviews: {...state.allReviews, [action.review.id]: action.review}
    //           }
    //       }

    //       // case REMOVE_REVIEW: {
  //       //   const newState = {...state, allReviews: { ...state.allReviews}}
  //       //   delete newState.allReviews[action.reviewId.id]
  //       //   return newState
  //       // }

  //     default:
  //       return state;
  //   }
  // };

  // export default reviewReducer;
  let initalState = {spot:{}, user:{}}
  export default function reviewReducers(state={spot:{}, user:{}}, action){
    switch (action.type) {
      case LOAD_REVIEWS:{
        //console.log("In LOAD_REVIEWS, state: ", state)
        //console.log('actionreviews+++++',action.reviews)
        let newState = { spot:{}, user:{} }

        action.reviewList.Reviews.forEach(review => {
          newState.spot[review.id] = review
        })
        //console.log("In LOAD_REVIEWS, newState: ", newState)
        return newState;
      }

      case CREATE_REVIEW:{
        const newState = { ...state, spot:{...state.spot}, user:{...state.user} }
        newState.spot[action.review.id] = action.review
        return newState
      }

      case REMOVE_REVIEW:{
        //console.log("In DELETE_REVIEW, state: ", state)
        const newState = { ...state, spot:{...state.spot}, user:{...state.user} }
        delete newState.user[action.reviewId.id]
        delete newState.spot[action.reviewId.id]
        //console.log("In DELETE_REVIEW, action: ", action)
        //console.log("In DELETE_REVIEW, newState: ", newState)
        return newState;
      }

        default:
            return state;
    }
}
