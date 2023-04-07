import { csrfFetch } from "./csrf";
const GET_BOOKINGS = 'bookings/GET_BOOKINGS'
const POST_BOOKING = 'bookings/POST_BOOKING'
const DELETE_BOOKING = 'bookings/DELETE_BOOKING'
const EDIT_BOOKING = 'bookings/EDIT_BOOKING'

const userBookings = (trips) => ({
    type: GET_BOOKINGS,
    trips
})

const postBooking = (booking) => ({
    type: POST_BOOKING,
    booking
})
const deleteBooking = (id) => ({
    type: DELETE_BOOKING,
    id
})
const editBooking = (booking) => ({
    type:EDIT_BOOKING,
    booking
})

export const editBookingThunk = (id, data) => async (dispatch) =>{
    const response = await csrfFetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    if(response.ok){
        const booking = await response.json()
        dispatch(editBooking(booking))
        getBookingsThunk()
        return booking
    }


}

export const deleteBookingThunk = (id) => async (dispatch) => {
    const response = await csrfFetch(`/api/bookings/${id}`,{
        method:'DELETE'
    })

    if(response.ok){
        const deleted = await response.json()
        dispatch(deleteBooking(id))
        return deleted
    }
}

export const postBookingThunk = (spotId, newBooking) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBooking)
    })
    console.log('back', response)
    if(response.ok){
        const booking = await response.json()
        dispatch(postBooking(booking))
        return booking
    } else{
        const error = await response.json()
        return error
    }
}

export const getBookingsThunk = () => async (dispatch) => {
    console.log('thunk')
    const response = await csrfFetch('/api/bookings/current')

    if(response.ok){
        const trips = await response.json()
        console.log('trps', trips)
        dispatch(userBookings(trips))
    }
}

const initialState = {bookings: {}}
const bookingReducer = (state = initialState, action ) => {
    switch(action.type){
        case GET_BOOKINGS:{
            const newState = {...state}
            const newBookings = {...state.bookings}
            action.trips.Bookings.forEach(booking => newBookings[booking.id] = booking)
            newState.bookings = newBookings
            return newState
        }
        case DELETE_BOOKING:{
            const newState = {...state}
            const newBookings = {...state.bookings}
            delete newBookings[action.id]
            newState.bookings = newBookings
            return newState
        }
        case EDIT_BOOKING:{
            const newState = {...state}
            const newBookings = {...state.bookings}
            newBookings[action.booking.id] = action.booking
            newState.bookings = newBookings
            return newState
        }

        default:
            return state
    }
}

export default bookingReducer
