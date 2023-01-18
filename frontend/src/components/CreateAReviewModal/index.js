import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { createReview } from '../../store/reviews';
import { useModal } from "../../context/Modal";
import { useParams } from 'react-router-dom';
import './CreateAReviewModal.css';





const CreateReviewModal = () => {
  // const spotSelectorId = useSelector(state => state.spots.oneSpot.id);
  // // console.log(spotSelector)
  // const {spotId} = useParams()
  // const dispatch = useDispatch();
  // const history = useHistory();
  // const [errors, setErrors] = useState([]);
  // const [hasSubmitted, setHasSubmitted] = useState(false)
  // const { closeModal } = useModal();

  //   const [review, setReview] = useState('');
  //   const [stars, setStars] = useState('');

  const {spotId} = useParams()
const dispatch = useDispatch()
const history = useHistory()
const state = useSelector(state => state);
console.log(state)
let userId;
if(state.session.user){
  userId = state.session.user.id
}

const [errors, setErrors] = useState([]);
const [stars, setStars] = useState('');
const [review, setReview] = useState('');

    // useEffect(() => {
    //   let error = [];

    //   if (!review) errors.push("Tell us about how your experience went")
    //   if (!stars) errors.push("Review must have star rating");
    //   if ( stars < 1 || stars > 5) errors.push("Please enter a rating between 1 and 5");
    //   setErrors(errors)
    // })

    const handleSubmit = async (e) => {
      e.preventDefault();
      // setHasSubmitted(true)
      // if (errors.length > 0) return;

    setErrors([])
    const payload = {
      spotId,
      userId,
        review,
        stars
      };
      // console.log(payload)
      // console.log(spotForId)

    // return dispatch(createReview(spotSelectorId, payload))
    // .then (() => history.push(`/`))
    // .catch(async (res) => {
    //   const data = await res.json();
    //   if (data.message === '"undefined" is not a valid integer') {
    //     setErrors('User is only allowed one review per spot')
    //   };

    //   if (data && data.errors) {
    //     setErrors(data.errors);
    //   };

    //   if (data && data.message) {
    //     setErrors([data.message])
    //   };
    //   });

    const dispatched = dispatch(createReview(spotId, payload))
    .catch(async (res) => {
      const data = await res.json();
      if (data.message === '"undefined" is not a valid integer') {
        setErrors('User is only allowed one review per spot')
      };

      // if (data.message === )

      if (data && data.errors) {
        setErrors(data.errors);
      };

      if (data && data.message) {
        setErrors([data.message])
      };

      if (dispatched) (
        history.push(`/`)
      )
      });
  }

      return (
        <nav>
           <h1 className='create-review-title'>Create your Review</h1>
           <form onSubmit={handleSubmit}>
           {/* {hasSubmitted && errors.length > 0 && ( */}
            <ul>
              {errors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
          {/* )} */}
            <label>
              {/* Review */}
              <input className='input-values'
                type="text"
                placeholder='Review'
                value={review}
                onChange={(e) => setReview(e.target.value)}
                required
              />
            </label>
            <label>
              {/* Stars */}
              <input className='input-values'
                type="number"
                placeholder='Stars'
                value={stars}
                min='1'
                max='5'
                onChange={(e) => setStars(e.target.value)}
                required
              />
            </label>
            <button className='submit-button' type="submit">Save</button>
          </form>
            </nav>
          )
}

    export default CreateReviewModal;
