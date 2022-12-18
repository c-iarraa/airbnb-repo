import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory,  } from 'react-router-dom';
import { createReview } from '../../store/reviews';
import { useModal } from "../../context/Modal";
import { useParams } from 'react-router-dom';





const CreateReviewModal = () => {
  const spotSelectorId = useSelector(state => state.spots.oneSpot.id);
  // console.log(spotSelector)
  const dispatch = useDispatch();
  const history = useHistory();
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();
  const {spotForId} = useParams()

    const [review, setReview] = useState('');
    const [stars, setStars] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

    setErrors([])
    const payload = {
        review,
        stars
      };
      console.log(payload)
      // console.log(spotForId)

    // let createdReview = dispatch(createReview(payload))
    // if (createdReview) {
    //     history.push(`/`);
    //     // hideForm();
    // };
    return dispatch(createReview(spotSelectorId, payload))

    // closeModal();
  }

    // const handleCancelClick = (e) => {
    //     e.preventDefault();
    //     // hideForm();
    //   };


      return (
        <nav>
           <h1>Create your Review</h1>
           <form onSubmit={handleSubmit}>
            <ul>
              {errors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
            <label>
              Review
              <input
                type="text"
                placeholder='Review'
                value={review}
                onChange={(e) => setReview(e.target.value)}
                required
              />
            </label>
            <label>
              Stars
              <input
                type="number"
                placeholder='Stars'
                value={stars}
                onChange={(e) => setStars(e.target.value)}
                required
              />
            </label>
            <button type="submit">Save</button>
          </form>
            </nav>
          )
}

    export default CreateReviewModal;
